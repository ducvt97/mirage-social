import {
  Args,
  ID,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserService } from 'src/user/user.service';
import { User } from './user.model';
import { Conversation } from 'src/post/graphql/conversation.model';
import { MessageService } from 'src/message/message.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    private messageService: MessageService,
  ) {}

  @Query(() => User)
  async user(@Args('id', { type: () => ID }) id: string) {
    return this.userService.getUserById(id);
  }

  @ResolveField()
  async friends(@Parent() friends: User[]) {
    const ids = friends.map(({ id }) => id);
    if (!ids.length) return [];
    return this.userService.getUsersById(ids);
  }

  @ResolveField()
  async friendRequests(@Parent() friendRequests: User[]) {
    const ids = friendRequests.map(({ id }) => id);
    if (!ids.length) return [];
    return this.userService.getUsersById(ids);
  }

  @ResolveField()
  async friendRequestsSent(@Parent() friendRequestsSent: User[]) {
    const ids = friendRequestsSent.map(({ id }) => id);
    if (!ids.length) return [];
    return this.userService.getUsersById(ids);
  }

  @ResolveField()
  async conversations(@Parent() conversations: Conversation[]) {
    const ids = conversations.map(({ id }) => id);
    if (!ids.length) return [];
    return this.messageService.findConversationsById(ids);
  }

  @ResolveField()
  async unreadConversations(@Parent() unreadConversations: Conversation[]) {
    const ids = unreadConversations.map(({ id }) => id);
    if (!ids.length) return [];
    return this.messageService.findConversationsById(ids);
  }
}
