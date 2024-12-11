import type { NotificationSchema } from "../schema";
import type { ServerResponse } from "../server-response";

export interface GetNotificationsByUserResponse extends ServerResponse {
  data?: NotificationSchema[];
  error?: string;
}
