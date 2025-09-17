import { PostStatusType } from 'src/common/constants/enums';

import { Field, Int, ObjectType, ID } from '@nestjs/graphql';
import { User } from './user.model';
import { Comment } from './comment.model';

@ObjectType()
export class Post {
  @Field(type => ID)
  id: string;

  @Field(type => User)
  userId: User;

  @Field()
  caption: string;

  // @Field({ defaultValue: PostStatusType.PUBLIC, enum: PostStatusType })
  @Field({ defaultValue: PostStatusType.PUBLIC })
  status: string;

  @Field(type => [String])
  content: string[];

  @Field(type => Int, { defaultValue: 0 })
  likes: number;

  @Field(type => [User], { defaultValue: [] })
  usersLike: User[];

  @Field(type => [User], { defaultValue: [] })
  tags: User[];

  @Field(type => [Comment], { defaultValue: [] })
  comments: Comment[];
}
