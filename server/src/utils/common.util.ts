import { NotificationType } from 'src/common/constants/enums';
import { Notification } from 'src/schemas/notification.schema';

export const createNotificationInstance = (
  userId: string,
  userActionId: string,
  postId: string,
  type: NotificationType,
  commentId?: string,
): Notification => {
  const notification = new Notification();
  notification.userId = userId;
  notification.userActionId = userActionId;
  notification.postId = postId;
  notification.type = type;
  notification.commentId = commentId;

  return notification;
};
