import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';

export type PostDocument = mongoose.HydratedDocument<Post>;

@Schema()
export class Post {
  _id: mongoose.Schema.Types.ObjectId;

  createdAt: Date;

  @Prop()
  caption: string;

  @Prop()
  content: string[];

  @Prop()
  likes: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  usersLike: User[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  tags: User[];

  @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } })
  userId: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
  comments: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
