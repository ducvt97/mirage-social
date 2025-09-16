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
import { CommentService } from 'src/comment/comment.service';
import { Comment } from 'src/schemas/comment.schema';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('notification')
export class NotificationController {
  constructor(
    private notificationService: NotificationService,
    private userService: UserService,
    private postService: PostService,
    private commentService: CommentService,
  ) {}

  @ApiBearerAuth()
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
      const getCommentsDetails: Promise<Comment>[] = [];
      for (const notification of notifications) {
        getUsersDetails.push(this.userService.getUserById(notification.userActionId));
        getPostsDetails.push(this.postService.getPostById(notification.postId));
        if (notification.commentId) {
          getCommentsDetails.push(
            this.commentService.getCommentById(notification.commentId),
          );
        }
      }

      const usersDetailsPromise = Promise.all(getUsersDetails);
      const postsDetailsPromise = Promise.all(getPostsDetails);
      const commentsDetailsPromise = Promise.all(getCommentsDetails);
      const [usersDetails, postsDetails, commentsDetails] = await Promise.all([
        usersDetailsPromise,
        postsDetailsPromise,
        commentsDetailsPromise,
      ]);

      const notificationsDetails = notifications.map((item) => ({
        ...item['_doc'],
        userActionDetails: usersDetails.find(
          (user) => String(user._id) === item.userActionId,
        ),
        postDetails: postsDetails.find(
          (post) => String(post._id) === item.postId,
        ),
        ...(item.commentId && {
          commentDetails: commentsDetails.find(
            (comment) => String(comment._id) === item.commentId,
          ),
        }),
      }));
      return handleResponse(notificationsDetails);
    } catch (error) {
      return handleError(error);
    }
  }
}
