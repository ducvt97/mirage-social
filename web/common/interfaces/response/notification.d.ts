import type {
  CommentSchema,
  NotificationSchema,
  PostSchema,
  UserSchema,
} from "../schema";
import type { ServerResponse } from "../server-response";

export interface NotificationDetail extends NotificationSchema {
  usersActionDetails: UserSchema;
  postsDetails: PostSchema;
  commentsDetails?: CommentSchema;
}

export interface GetNotificationsByUserResponse extends ServerResponse {
  data?: NotificationDetail[];
  error?: string;
}
