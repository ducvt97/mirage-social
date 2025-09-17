import { Field, Int, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field((type) => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field({
    defaultValue:
      'https://www.shutterstock.com/image-vector/male-avatar-profile-picture-use-600nw-193292036.jpg',
  })
  avatar: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  dob: string;

  @Field((type) => [User])
  friends: User[];

  @Field((type) => [User])
  friendRequests: User[];

  @Field((type) => [User])
  friendRequestsSent: string[];

  @Field((type) => [User])
  conversations: string[];

  @Field((type) => [User])
  unreadConversations: string[];
}
