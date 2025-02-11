import type { ConversationDetail } from "../component";
import type { UserSchema, MessageSchema } from "../schema";
import type { ServerResponse } from "../server-response";

interface SendMessageResponseData {
  message: MessageSchema;
  user: UserSchema;
}

export interface SendMessageResponse extends ServerResponse {
  data?: SendMessageResponseData;
  error?: string;
}

export interface GetUserConversationsResponse extends ServerResponse {
  data?: ConversationDetail[];
  error?: string;
}
