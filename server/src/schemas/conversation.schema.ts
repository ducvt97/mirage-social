import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type ConversationDocument = mongoose.HydratedDocument<Conversation>;

@Schema({ timestamps: true })
export class Conversation {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  avatar: string;

  @Prop({ default: false })
  isGroup: boolean;

  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  members: string[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
