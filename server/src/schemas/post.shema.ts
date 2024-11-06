import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

enum StatusType {
  PUBLIC = 'Public',
  PRIVATE = 'Private',
}

export type PostDocument = mongoose.HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  caption: string;

  @Prop({ default: StatusType.PUBLIC, enum: StatusType })
  status: string;

  @Prop()
  content: string[];

  @Prop({ default: 0 })
  likes: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  usersLike: string[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  tags: string[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
  comments: string[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
