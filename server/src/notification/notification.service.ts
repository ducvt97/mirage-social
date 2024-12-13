import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetWithPagingDTO } from 'src/common/dto/get-with-paging-dto';
import {
  Notification,
  NotificationDocument,
} from 'src/schemas/notification.schema';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private notificationGateway: NotificationGateway,
  ) {}

  async addNotification(notification: Notification): Promise<Notification> {
    try {
      delete notification._id;
      const existNotification = await this.notificationModel.findOne({
        type: notification.type,
        userId: notification.userId,
        postId: notification.postId,
        ...(notification.commentId && { commentId: notification.commentId }),
      });

      if (existNotification) {
        existNotification.userActionId = notification.userActionId;
        existNotification.read = false;
        await existNotification.save();
        this.notificationGateway.sendNotification(existNotification.userId, '');
        return existNotification;
      }

      const newNotification = new this.notificationModel(notification);
      await newNotification.save();
      return newNotification;
    } catch (error) {
      return Promise.reject('Something went wrong.');
    }
  }

  async getNotificationByUser(
    userId: string,
    { page, pageSize }: GetWithPagingDTO,
  ): Promise<Notification[]> {
    try {
      const notifications = await this.notificationModel.find(
        { userId },
        {},
        { skip: page * pageSize, limit: pageSize, sort: { updatedAt: -1 } },
      );
      return notifications;
    } catch (error) {
      Promise.reject('Something went wrong.');
    }
  }
}
