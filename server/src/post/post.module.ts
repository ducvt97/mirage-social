import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Post, PostSchema } from 'src/schemas/post.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from 'src/user/user.service';
import { User, UserSchema } from 'src/schemas/user.schema';
import { CommentService } from 'src/comment/comment.service';
import { Comment, CommentSchema } from 'src/schemas/comment.schema';
import { NotificationService } from 'src/notification/notification.service';
import {
  Notification,
  NotificationSchema,
} from 'src/schemas/notification.schema';
import { NotificationGateway } from 'src/notification/notification.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UserSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [PostController],
  providers: [
    PostService,
    UserService,
    CommentService,
    NotificationService,
    NotificationGateway,
  ],
})
export class PostModule {}
