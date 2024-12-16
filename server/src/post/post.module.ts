import { forwardRef, Module } from '@nestjs/common';
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
import { NotificationModule } from 'src/notification/notification.module';
import { UserModule } from 'src/user/user.module';
import { CommentModule } from 'src/comment/comment.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    forwardRef(() => UserModule),
    forwardRef(() => CommentModule),
    forwardRef(() => NotificationModule),
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
