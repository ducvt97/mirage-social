import { Args, Int, ResolveField, Parent, Resolver, Query, ID } from "@nestjs/graphql";
import { Post } from "./post.model";
import { UserService } from "src/user/user.service";
import { PostService } from "../post.service";
import { User } from "./user.model";
import { Comment } from "./comment.model";
import { CommentService } from "src/comment/comment.service";

@Resolver(() => Post)
export class PostResolver {
  constructor(
    private userService: UserService,
    private postService: PostService,
    private commentService: CommentService,
  ) {}

  @Query(() => Post)
  async post(@Args('id', { type: () => ID }) id: string) {
    return this.postService.getPostById(id);
  }

  @ResolveField()
  async userId(@Parent() user: User) {
    const { id } = user;
    return this.userService.getUserById(id);
  }

  @ResolveField()
  async usersLike(@Parent() users: [User]) {
    const ids = users.map(({ id }) => id);
    return this.userService.getUsersById(ids);
  }

  @ResolveField()
  async tags(@Parent() usersTag: [User]) {
    const ids = usersTag.map(({ id }) => id);
    return this.userService.getUsersById(ids);
  }

  @ResolveField()
  async comments(@Parent() comment: [Comment]) {
    const ids = comment.map(({ id }) => id);
    return this.commentService.getCommentsById(ids);
  }
}