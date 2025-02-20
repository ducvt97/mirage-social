import type { GetWithPaging } from "./common";

export interface SendMessageRequest {
  text: string;
  content?: string;
  receiverId?: string;
  conversationId?: string;
}

export interface GetConversationDetailRequest {
  conversationId: string;
}

export interface GetConversationMessagesRequest extends GetWithPaging {
  conversationId: string;
}

export interface GetDirectConversationsRequest {
  receiverId: string;
}
