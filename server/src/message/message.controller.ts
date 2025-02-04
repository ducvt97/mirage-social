import { Body, Controller, Post, UseGuards, Headers } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { NotificationService } from 'src/notification/notification.service';
import { parseJWT } from 'src/utils/jwt.util';
import { handleResponse, handleError } from 'src/utils/response.util';
import { SendMessageDTO } from './dto/send-message.dto';
import { MessageService } from './message.service';
import { UserService } from 'src/user/user.service';

@Controller('message')
export class MessageController {
  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private notificationService: NotificationService,
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

          if (conversation) {
            const message = await this.messageService.addMessage({
              text,
              content,
              senderId: userId,
              conversationId: String(conversation._id),
            });
            return handleResponse(message);
          } else {
            const receiver = await this.userService.getUserById(receiverId);
            if (!receiver) {
              return handleError('User does not exist.');
            }

            const newConversation =
              await this.messageService.createConversation({
                name: `${receiver.firstName} ${receiver.lastName}`,
                avatar: receiver.avatar,
                isGroup: false,
                members: [userId, receiverId],
              });

            const message = await this.messageService.addMessage({
              text,
              content,
              senderId: userId,
              conversationId: String(newConversation._id),
            });
            return handleResponse(message);
          }
        }

        return handleError('Something went wrong.');
      }
    } catch (error) {
      return handleError(error);
    }
  }
}
