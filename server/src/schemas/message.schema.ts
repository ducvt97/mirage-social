import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type MessageDocument = mongoose.HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  text: string;

  @Prop()
  content: string;

  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true })
  conversationId: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
