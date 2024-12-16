import { Comment } from 'src/schemas/comment.schema';
import { Notification } from 'src/schemas/notification.schema';
import { Post } from 'src/schemas/post.schema';
import { User } from 'src/schemas/user.schema';

export interface NotificationDetail extends Notification {
  usersActionDetails: User;
  postsDetails: Post;
  commentsDetails?: Comment;
}
