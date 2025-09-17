import { Field, ObjectType, ID } from '@nestjs/graphql';
import { User } from './user.model';

@ObjectType()
export class Conversation {
  @Field((type) => ID)
  id: string;

  @Field()
  name: string;

  @Field({ defaultValue: '' })
  avatar: string;

  @Field({ defaultValue: false })
  isGroup: boolean;

  @Field((type) => [User])
  members: User[];
}
