// Common
export type { UserCommonInfo } from "./common";
export type {
  Error,
  ServerResponse,
  BooleanDataResponse,
} from "./server-response";

// Request
export type {
  // Auth
  LoginRequest,
  RegisterRequest,
  // Post
  CreatePostRequest,
  LikePostRequest,
  UpdatePostRequest,
  GetPostsByUserRequest,
  // Comment
  CommentOnPostRequest,
  GetCommentsByPostRequest,
  GetCommentsByCommentRequest,
  LikeCommentRequest,
  UpdateCommentRequest,
  // User
  UserFriendRequest,
  // Message
  SendMessageRequest,
  GetConversationDetailRequest,
  GetConversationMessagesRequest,
  GetDirectConversationsRequest,
  // Common
  GetWithPaging,
  SearchRequest,
} from "./request";

// Response
export type {
  // Auth
  LoginResponse,
  RegisterResponse,
  // Post
  PostCreateResponse,
  GetPostsByUserResponse,
  LikePostResponse,
  PostUpdateResponse,
  // Comment
  CommentOnPostResponse,
  GetCommentsByPostResponse,
  GetCommentsByCommentResponse,
  LikeCommentResponse,
  UpdateCommentResponse,
  // Notification
  NotificationDetail,
  GetNotificationsByUserResponse,
  // User
  GetUserInfoResponse,
  SearchUserResponse,
  // Message
  SendMessageResponse,
  GetUserConversationsResponse,
  GetConversationDetailResponse,
  GetConversationMessagesResponse,
} from "./response";

// Schema
export type {
  PostSchema,
  UserSchema,
  CommentSchema,
  NotificationSchema,
  ConversationSchema,
  MessageSchema,
} from "./schema";

// Component
export type {
  PostDetail,
  CommentDetail,
  ConversationDetail,
} from "./component";

// Properties
export type { ModalProps, ConfirmModalProps } from "./properties";
