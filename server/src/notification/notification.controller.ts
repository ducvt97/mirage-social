import { Controller, Get, Headers, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetWithPagingDTO } from 'src/common/dto/get-with-paging-dto';
import { parseJWT } from 'src/utils/jwt.util';
import { NotificationService } from './notification.service';
import { handleError, handleResponse } from 'src/utils/response.util';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Get('getByCurrentUser')
  async getNotificationsByCurrentUser(
    @Query() paging: GetWithPagingDTO,
    @Headers('Authorization') token: string = '',
  ) {
    try {
      const { sub: userId } = parseJWT(token);
      const notifications =
        await this.notificationService.getNotificationByUser(userId, paging);
      return handleResponse(notifications);
    } catch (error) {
      return handleError(error);
    }
  }
}
