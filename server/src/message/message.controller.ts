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
import { parseJWT } from 'src/utils/jwt.util';
import { handleResponse, handleError } from 'src/utils/response.util';
import { GetMessagesDTO, SendMessageDTO } from './dto/send-message.dto';
import { MessageService } from './message.service';
import { UserService } from 'src/user/user.service';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { GetWithPagingDTO } from 'src/common/dto/get-with-paging-dto';
import { Conversation } from 'src/schemas/conversation.schema';
import { Message } from 'src/schemas/message.schema';
import { GetDirectConversationDTO } from './dto/conversation.dto';
import { User } from 'src/schemas/user.schema';

@Controller('message')
export class MessageController {
  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private notificationGateway: NotificationGateway,
  ) {}
  // Message APIs
  @UseGuards(JwtAuthGuard)
  @Post('sendMessage')
  async sendMessage(
    @Body() reqBody: SendMessageDTO,
    @Headers('Authorization') token: string = '',
  ) {
    debugger;
    const { sub: userId } = parseJWT(token);
    try {
      const { text, content, conversationId, receiverId } = reqBody;
      if (conversationId) {
        const conversation =
          await this.messageService.findConversationById(conversationId);
        if (!conversation) {
          return handleError('Conversation does not exist.');
        }

        const message = await this.messageService.addMessage({
          text,
          content,
          senderId: userId,
          conversationId: String(conversation._id),
        });

        conversation.members.forEach((item) => {
          const receiverId = String(item);
          if (receiverId !== userId) {
            this.userService.addNewMessage(
              receiverId,
              String(conversation._id),
            );
            this.notificationGateway.sendMessageNotification(
              receiverId,
              message,
            );
          }
        });

        const user = await this.userService.addNewMessage(
          userId,
          String(conversation._id),
        );
        return handleResponse({ message, user });
      } else {
        if (receiverId) {
          const isSentYourself = userId === receiverId;
          const conversation = await this.messageService.findDirectConversation(
            [userId, ...(isSentYourself ? [] : [receiverId])],
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
                members: [userId, ...(isSentYourself ? [] : [receiverId])],
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
            ...(isSentYourself
              ? []
              : [
                  this.userService.addNewMessage(
                    receiverId,
                    message.conversationId,
                  ),
                ]),
          ]);

          if (!isSentYourself) {
            this.notificationGateway.sendMessageNotification(
              receiverId,
              message,
            );
          }

          return handleResponse({ message, user });
        }

        return handleError('Something went wrong.');
      }
    } catch (error) {
      return handleError(error);
    }
  }
  @UseGuards(JwtAuthGuard)
  @Get('getConversationMessages')
  async getConversationMessages(
    @Query() { conversationId, page = 0 }: GetMessagesDTO,
    @Headers('Authorization') token: string = '',
  ) {
    const { sub: userId } = parseJWT(token);
    try {
      const conversation =
        await this.messageService.findConversationById(conversationId);
      if (!conversation) {
        return handleError('Conversation does not exist.');
      }

      const isMember = conversation.members.find(
        (item) => String(item) === userId,
      );
      if (!isMember) {
        return handleError('Permission denied.');
      }

      const messages = await this.messageService.getMessagesByConversation(
        conversationId,
        page,
      );

      return handleResponse(messages);
    } catch (error) {
      return handleError(error);
    }
  }

  // Conversation APIs
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
          this.messageService.userGetConversationById(userId, conversationId),
        );
      }

      let messages = await Promise.all(getMessages);
      messages = messages.filter((item) => !!item);
      let conversationsDetails = await Promise.all(getConversationsDetails);
      conversationsDetails = conversationsDetails.filter((item) => !!item);

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

  @UseGuards(JwtAuthGuard)
  @Get('getUserConversationById')
  async getUserConversationById(
    @Query() { conversationId }: GetMessagesDTO,
    @Headers('Authorization') token: string = '',
  ) {
    const { sub: userId } = parseJWT(token);
    try {
      const user = await this.userService.getUserById(userId);
      if (!user) {
        return handleError('User does not exist.');
      }

      const isMember = user.conversations.find(
        (item) => String(item) === conversationId,
      );
      if (!isMember) {
        return handleError('Permission denied.');
      }

      const getMessages =
        this.messageService.getLastMessageOfConversation(conversationId);
      const getConversation = this.messageService.userGetConversationById(
        userId,
        conversationId,
      );

      const [message, conversation] = await Promise.all([
        getMessages,
        getConversation,
      ]);

      const dataResponse = {
        ...conversation['_doc'],
        message,
      };

      return handleResponse(dataResponse);
    } catch (error) {
      return handleError(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('getConversationDetail')
  async getConversationDetail(
    @Query() { conversationId }: GetMessagesDTO,
    @Headers('Authorization') token: string = '',
  ) {
    const { sub: userId } = parseJWT(token);
    try {
      const conversation =
        await this.messageService.findConversationById(conversationId);
      if (!conversation) {
        return handleError('Conversation does not exist.');
      }

      const isMember = conversation.members.find(
        (item) => String(item) === userId,
      );
      if (!isMember) {
        return handleError('Permission denied.');
      }

      const membersDetail = await this.userService.getUsersById(
        conversation.members,
      );
      return handleResponse({ conversation, membersDetail });
    } catch (error) {
      return handleError(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('getDirectConversations')
  async getDirectConversations(
    @Query() { receiverId }: GetDirectConversationDTO,
    @Headers('Authorization') token: string = '',
  ) {
    const { sub: userId } = parseJWT(token);
    try {
      const conversation = await this.messageService.findDirectConversation([
        userId,
        ...(userId !== receiverId ? [receiverId] : []),
      ]);

      let membersDetail: User[] = [];
      if (conversation) {
        membersDetail = await this.userService.getUsersById(
          conversation.members,
        );
      } else {
        membersDetail.push(await this.userService.getUserById(receiverId));
      }

      return handleResponse({ conversation, membersDetail });
    } catch (error) {
      return handleError(error);
    }
  }
}
