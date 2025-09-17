import {
  Args,
  ID,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserService } from 'src/user/user.service';
import { PostService } from 'src/post/post.service';
import { CommentService } from 'src/comment/comment.service';
import { User } from './user.model';
import { Post } from './post.model';
import { Comment } from './comment.model';
import { Conversation } from './conversation.model';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    private postService: PostService,
    private commentService: CommentService,
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
    return this.userService.getUsersById(ids);
  }

  @ResolveField()
  async unreadConversations(@Parent() unreadConversations: Conversation[]) {
    const ids = unreadConversations.map(({ id }) => id);
    if (!ids.length) return [];
    return this.userService.getUsersById(ids);
  }
}
