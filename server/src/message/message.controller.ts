import { Body, Controller, Post, UseGuards, Headers } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { NotificationService } from 'src/notification/notification.service';
import { parseJWT } from 'src/utils/jwt.util';
import { handleResponse, handleError } from 'src/utils/response.util';
import { SendMessageDTO } from './dto/send-message.dto';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(
    private messageService: MessageService,
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
      const message = await this.messageService.addMessage(reqBody);
      return handleResponse(message);
    } catch (error) {
      return handleError(error);
    }
  }
}
