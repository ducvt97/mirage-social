export interface ConversationSchema {
  _id: string;
  name: string;
  avatar: string;
  isGroup: boolean;
  members: string[];
}
