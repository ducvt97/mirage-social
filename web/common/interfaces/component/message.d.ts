import type { MessageSchema, ConversationSchema } from "../schema";

export interface ConversationDetail extends ConversationSchema {
  message: MessageSchema;
}
