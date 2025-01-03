import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { NotificationType } from 'src/common/constants/enums';

export type NotificationDocument = mongoose.HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, enum: NotificationType })
  type: string;

  @Prop({ required: true })
  userActionId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  postId: string;

  @Prop()
  commentId: string;

  @Prop({ default: false })
  read: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
