import type { MessageSchema, ConversationSchema } from "../schema";

export interface ConversationDetail extends ConversationSchema {
  message?: MessageSchema;
}

export interface MessageDetail extends MessageSchema {
  senderName?: string;
  senderAvatar?: string;
}
