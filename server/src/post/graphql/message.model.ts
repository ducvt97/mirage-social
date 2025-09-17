import { Field, ObjectType, ID } from '@nestjs/graphql';
import { User } from 'src/user/graphql/user.model';
import { Conversation } from './conversation.model';

@ObjectType()
export class Comment {
  @Field((type) => ID)
  id: string;

  @Field()
  text: string;

  @Field({ nullable: true })
  content: string;

  @Field((type) => User)
  senderId: User;

  @Field((type) => Conversation)
  conversationId: Conversation;
}
