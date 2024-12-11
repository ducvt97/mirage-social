import type { NotificationType } from "~/common/constants/enums";

export interface NotificationSchema {
  _id: string;
  type: NotificationType;
  usersActionNumber: number;
  usersAction: string[];
  userId: string;
  postId: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}
