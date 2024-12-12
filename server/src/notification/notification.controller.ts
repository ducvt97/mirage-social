import { Controller, Get, Headers, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetWithPagingDTO } from 'src/common/dto/get-with-paging-dto';
import { parseJWT } from 'src/utils/jwt.util';
import { NotificationService } from './notification.service';
import { handleError, handleResponse } from 'src/utils/response.util';
import { User } from 'src/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { Post } from 'src/schemas/post.schema';
import { PostService } from 'src/post/post.service';

@Controller('notification')
export class NotificationController {
  constructor(
    private notificationService: NotificationService,
    private userService: UserService,
    private postService: PostService,
  ) {}

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

      const getUsersDetails: Promise<User>[] = [];
      const getPostsDetails: Promise<Post>[] = [];
      for (const notification of notifications) {
        getUsersDetails.push(this.userService.getUserById(notification.userId));
        getPostsDetails.push(this.postService.getPostById(notification.postId));
      }

      const usersDetailsPromise = Promise.all(getUsersDetails);
      const postsDetailsPromise = Promise.all(getPostsDetails);
      const [usersDetails, postsDetails] = await Promise.all([
        usersDetailsPromise,
        postsDetailsPromise,
      ]);

      const notificationsDetails = notifications.map((item) => ({
        ...item['_doc'],
        usersActionDetails: usersDetails.find(
          (user) => String(user._id) === item.userId,
        ),
        postsDetails: postsDetails.find(
          (post) => String(post._id) === item.postId,
        ),
      }));
      return handleResponse(notificationsDetails);
    } catch (error) {
      return handleError(error);
    }
  }
}
