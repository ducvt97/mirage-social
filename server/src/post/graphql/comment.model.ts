import { Field, Int, ObjectType, ID } from '@nestjs/graphql';
import { Post } from './post.model';
import { User } from './user.model';

@ObjectType()
export class Comment {
  @Field((type) => ID)
  id: string;

  @Field()
  caption: string;

  @Field({ nullable: true })
  content: string;

  @Field((type) => Int, { defaultValue: 0 })
  likes: number;

  @Field((type) => [User])
  usersLike: User[];

  @Field((type) => User)
  userId: User;

  @Field((type) => Post)
  postId: Post;

  @Field((type) => Int, { defaultValue: 0 })
  replies: number;

  @Field((type) => [Comment])
  replyComments: Comment[];

  @Field((type) => Comment)
  replyCommentId: Comment;
}
