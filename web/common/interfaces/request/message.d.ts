export interface SendMessageRequest {
  text: string;
  content?: string;
  receiverId?: string;
  conversationId?: string;
}
