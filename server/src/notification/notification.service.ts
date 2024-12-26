import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetWithPagingDTO } from 'src/common/dto/get-with-paging-dto';
import {
  Notification,
  NotificationDocument,
} from 'src/schemas/notification.schema';
import { NotificationGateway } from './notification.gateway';
import { UserService } from 'src/user/user.service';
import { PostService } from 'src/post/post.service';
import { CommentService } from 'src/comment/comment.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private notificationGateway: NotificationGateway,
    private userService: UserService,
    @Inject(forwardRef(() => PostService)) private postService: PostService,
    private commentService: CommentService,
  ) {}

  async addNotification(notification: Notification): Promise<Notification> {
    if (
      notification.userId &&
      notification.userActionId &&
      notification.userId === notification.userActionId
    ) {
      return null;
    }

    try {
      delete notification._id;
      const existNotification = await this.notificationModel.findOne({
        type: notification.type,
        userId: notification.userId,
        postId: notification.postId,
        ...(notification.commentId && { commentId: notification.commentId }),
      });

      const getUserDetails = this.userService.getUserById(
        notification.userActionId,
      );
      const getPostDetails = this.postService.getPostById(notification.postId);
      const getCommentDetails = this.commentService.getCommentById(
        notification.commentId,
      );
      const [userDetails, postDetails, commentDetails] = await Promise.all([
        getUserDetails,
        getPostDetails,
        getCommentDetails,
      ]);
      const notificationDetails = {
        userActionDetails: userDetails,
        postDetails,
        commentDetails,
      };

      if (existNotification) {
        existNotification.userActionId = notification.userActionId;
        existNotification.read = false;
        await existNotification.save();
        this.notificationGateway.sendNotification(existNotification.userId, {
          ...existNotification['_doc'],
          ...notificationDetails,
        });
        return existNotification;
      }

      const newNotification = new this.notificationModel(notification);
      await newNotification.save();
      this.notificationGateway.sendNotification(newNotification.userId, {
        ...newNotification['_doc'],
        ...notificationDetails,
      });
      return newNotification;
    } catch (error) {
      return Promise.reject('Something went wrong.');
    }
  }

  async getNotificationByUser(
    userId: string,
    { page = 0, pageSize = 10 }: GetWithPagingDTO,
  ): Promise<Notification[]> {
    try {
      const notifications = await this.notificationModel.find(
        { userId },
        {},
        { skip: page * pageSize, limit: pageSize, sort: { updatedAt: -1 } },
      );
      console.log(notifications);

      return notifications;
    } catch (error) {
      console.log(error);

      Promise.reject('Something went wrong.');
    }
  }
}
