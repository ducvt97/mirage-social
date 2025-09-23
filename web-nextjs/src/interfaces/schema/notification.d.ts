import type { NotificationType } from "~/common/constants/enums";

export interface NotificationSchema {
  _id: string;
  type: NotificationType;
  userActionId: string;
  userId: string;
  postId: string;
  commentId: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}
