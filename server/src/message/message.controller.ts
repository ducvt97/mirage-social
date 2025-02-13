import {
  Body,
  Controller,
  Post,
  UseGuards,
  Headers,
  Get,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { NotificationService } from 'src/notification/notification.service';
import { parseJWT } from 'src/utils/jwt.util';
import { handleResponse, handleError } from 'src/utils/response.util';
import { SendMessageDTO } from './dto/send-message.dto';
import { MessageService } from './message.service';
import { UserService } from 'src/user/user.service';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { GetWithPagingDTO } from 'src/common/dto/get-with-paging-dto';
import { Conversation } from 'src/schemas/conversation.schema';
import { Message } from 'src/schemas/message.schema';

@Controller('message')
export class MessageController {
  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private notificationGateway: NotificationGateway,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('sendMessage')
  async sendMessage(
    @Body() reqBody: SendMessageDTO,
    @Headers('Authorization') token: string = '',
  ) {
    const { sub: userId } = parseJWT(token);
    try {
      const { text, content, conversationId, receiverId } = reqBody;
      if (conversationId) {
        const conversation =
          await this.messageService.findConversationById(conversationId);
        if (!conversation) {
          return handleError('Conversation does not exist.');
        }
      } else {
        if (receiverId) {
          const conversation = await this.messageService.findDirectConversation(
            [userId, receiverId],
          );
          let message: any = {};

          if (conversation) {
            message = await this.messageService.addMessage({
              text,
              content,
              senderId: userId,
              conversationId: String(conversation._id),
            });
          } else {
            const receiver = await this.userService.getUserById(receiverId);
            if (!receiver) {
              return handleError('User does not exist.');
            }

            const newConversation =
              await this.messageService.createConversation({
                isGroup: false,
                members: [userId, receiverId],
              });

            message = await this.messageService.addMessage({
              text,
              content,
              senderId: userId,
              conversationId: String(newConversation._id),
            });
          }

          const [user] = await Promise.all([
            this.userService.addNewMessage(userId, message.conversationId),
            this.userService.addNewMessage(receiverId, message.conversationId),
          ]);

          this.notificationGateway.sendMessageNotification(receiverId, message);
          return handleResponse({ message, user });
        }

        return handleError('Something went wrong.');
      }
    } catch (error) {
      return handleError(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('getUserConversations')
  async getUserConversations(
    @Query() { page = 0, pageSize = 10 }: GetWithPagingDTO,
    @Headers('Authorization') token: string = '',
  ) {
    const { sub: userId } = parseJWT(token);
    try {
      const user = await this.userService.getUserById(userId);
      if (!user) {
        return handleError('User does not exist.');
      }

      const fromIndex = page * pageSize;
      if (fromIndex >= user.conversations.length) {
        return handleResponse([]);
      }

      const conversationIds = user.conversations.slice(
        fromIndex,
        fromIndex + pageSize,
      );
      const getMessages: Promise<Message>[] = [];
      const getConversationsDetails: Promise<Conversation>[] = [];

      for (const conversationId of conversationIds) {
        getMessages.push(
          this.messageService.getLastMessageOfConversation(conversationId),
        );
        getConversationsDetails.push(
          this.messageService.findConversationById(conversationId),
        );
      }

      const messages = await Promise.all(getMessages);
      const conversationsDetails = await Promise.all(getConversationsDetails);

      const dataResponse = conversationsDetails.map((item) => ({
        ...item['_doc'],
        message: messages.find(
          (message) => String(message.conversationId) === String(item._id),
        ),
      }));

      return handleResponse(dataResponse);
    } catch (error) {
      return handleError(error);
    }
  }
}
