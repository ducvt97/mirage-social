import { forwardRef, Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notification,
  NotificationSchema,
} from 'src/schemas/notification.schema';
import { NotificationGateway } from './notification.gateway';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Post, PostSchema } from 'src/schemas/post.schema';
import { Comment, CommentSchema } from 'src/schemas/comment.schema';
import { PostModule } from 'src/post/post.module';
import { CommentModule } from 'src/comment/comment.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => PostModule),
    forwardRef(() => CommentModule),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationGateway],
  exports: [NotificationService, NotificationGateway],
})
export class NotificationModule {}
