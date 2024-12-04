import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type CommentDocument = mongoose.HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  caption: string;

  @Prop()
  content: string;

  @Prop({ default: 0 })
  likes: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  usersLike: string[];

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  postId: string;

  @Prop({ default: 0 })
  replies: number;

  @Prop({
    default: null,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  })
  replyComments: string[];

  @Prop({ default: null })
  replyCommentId: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
