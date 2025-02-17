import type { ConversationDetail } from "../component";
import type { UserSchema, MessageSchema, ConversationSchema } from "../schema";
import type { ServerResponse } from "../server-response";

interface SendMessageResponseData {
  message: MessageSchema;
  user: UserSchema;
}

interface GetConversationDetailResponseData {
  conversation: ConversationSchema;
  membersDetail: UserSchema[];
}

export interface SendMessageResponse extends ServerResponse {
  data?: SendMessageResponseData;
  error?: string;
}

export interface GetUserConversationsResponse extends ServerResponse {
  data?: ConversationDetail[];
  error?: string;
}

export interface GetConversationDetailResponse extends ServerResponse {
  data?: GetConversationDetailResponseData;
  error?: string;
}

export interface GetConversationMessagesResponse extends ServerResponse {
  data?: MessageSchema[];
  error?: string;
}
