import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CommentOnPostDTO } from './dto/comment-post.dto';
import { CommentService } from './comment.service';
import { parseJWT } from 'src/utils/jwt.util';
import { handleError, handleResponse } from 'src/utils/response.util';
import {
  GetCommentsByCommentDTO,
  GetCommentsByPostDTO,
} from './dto/get-comment.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/schemas/user.schema';
import { CommentUpdateDTO, LikeCommentDTO } from './dto/comment-update.dto';
import { NotificationService } from 'src/notification/notification.service';
import { Notification } from 'src/schemas/notification.schema';
import { createNotificationInstance } from 'src/utils/common.util';
import { NotificationType } from 'src/common/constants/enums';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('comment')
export class CommentController {
  constructor(
    private commentService: CommentService,
    private userService: UserService,
    private notificationService: NotificationService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async commentOnPost(
    @Body() body: CommentOnPostDTO,
    @Headers('Authorization') token: string = '',
  ) {
    try {
      const { sub: userId } = parseJWT(token);
      const getComment = this.commentService.createComment(userId, body);
      const getUser = this.userService.getUserById(userId);
      const [comment, user] = await Promise.all([getComment, getUser]);

      const notification = createNotificationInstance(
        comment.userId,
        userId,
        comment.postId,
        comment.replyCommentId
          ? NotificationType.REPLY_COMMENT
          : NotificationType.COMMENT_POST,
        comment.replyCommentId,
      );
      this.notificationService.addNotification(notification);

      return handleResponse({ ...comment['_doc'], userDetails: user });
    } catch (error) {
      handleError(error);
    }
  }

  @Get('getCommentsByPost')
  async getCommentsByPost(@Query() query: GetCommentsByPostDTO) {
    try {
      const comments = await this.commentService.getCommentsByPost(query);
      const getUsersDetails: Promise<User>[] = [];
      for (const comment of comments) {
        getUsersDetails.push(this.userService.getUserById(comment.userId));
      }

      const usersDetails = await Promise.all(getUsersDetails);
      const commentsDetails = comments.map((item) => ({
        ...item['_doc'],
        userDetails: usersDetails.find(
          (user) => String(user._id) === item.userId,
        ),
      }));

      return handleResponse(commentsDetails);
    } catch (error) {
      handleError(error);
    }
  }

  @Get('getCommentsByComment')
  async getCommentsByComment(@Query() query: GetCommentsByCommentDTO) {
    try {
      const comments = await this.commentService.getCommentsByComment(query);
      const getUsersDetails: Promise<User>[] = [];
      for (const comment of comments) {
        getUsersDetails.push(this.userService.getUserById(comment.userId));
      }

      const usersDetails = await Promise.all(getUsersDetails);
      const commentsDetails = comments.map((item) => ({
        ...item['_doc'],
        userDetails: usersDetails.find(
          (user) => String(user._id) === item.userId,
        ),
      }));
      return handleResponse(commentsDetails);
    } catch (error) {
      handleError(error);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('likeComment')
  async likeComment(
    @Body() { commentId }: LikeCommentDTO,
    @Headers('Authorization') token: string = '',
  ) {
    try {
      const { sub: userId } = parseJWT(token);
      const { comment, shouldSendNotification } =
        await this.commentService.likeComment(commentId, userId);

      if (shouldSendNotification) {
        const notification = createNotificationInstance(
          comment.userId,
          userId,
          comment.postId,
          NotificationType.LIKE_COMMENT,
          commentId,
        );
        this.notificationService.addNotification(notification);
      }

      return handleResponse({
        likes: comment.likes,
        usersLike: comment.usersLike,
      });
    } catch (error) {
      return handleError(error);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteComment(
    @Param('id') commentId: string,
    @Headers('Authorization') token: string = '',
  ) {
    try {
      const { sub: userId } = parseJWT(token);
      await this.commentService.deleteComment(commentId, userId);
      return handleResponse();
    } catch (error) {
      return handleError(error);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateComment(
    @Body() body: CommentUpdateDTO,
    @Headers('Authorization') token: string = '',
  ) {
    try {
      const { sub: userId } = parseJWT(token);
      const comment = await this.commentService.userUpdateComment(userId, body);
      return handleResponse(comment);
    } catch (error) {
      return handleError(error);
    }
  }
}
