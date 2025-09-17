import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class Comment {
  @Field((type) => ID)
  id: string;

  // @Prop({ required: true, enum: NotificationType })
  @Field()
  type: string;

  @Field((type) => ID)
  userActionId: string;

  @Field((type) => ID)
  userId: string;

  @Field((type) => ID)
  postId: string;

  @Field((type) => ID)
  commentId: string;

  @Field()
  read: boolean;
}
