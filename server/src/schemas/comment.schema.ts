import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';
import { Post } from './post.shema';

export type CommentDocument = mongoose.HydratedDocument<Comment>;

@Schema()
export class Comment {
  _id: mongoose.Schema.Types.ObjectId;

  createdAt: Date;

  @Prop({ required: true })
  caption: string;

  @Prop()
  content: string;

  @Prop({ default: 0 })
  likes: number;

  @Prop({
    default: [],
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  usersLike: User[];

  @Prop({
    required: true,
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  })
  userId: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] })
  postId: Post;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
  commentId: Comment;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
