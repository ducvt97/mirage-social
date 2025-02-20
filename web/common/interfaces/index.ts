// Common
export type { UserCommonInfo } from "./common";
export type {
  Error,
  ServerResponse,
  BooleanDataResponse,
} from "./server-response";

// Request
export type {
  CreatePostRequest,
  LoginRequest,
  RegisterRequest,
  LikePostRequest,
  UpdatePostRequest,
  GetPostsByUserRequest,
  CommentOnPostRequest,
  GetCommentsByPostRequest,
  GetCommentsByCommentRequest,
  LikeCommentRequest,
  UpdateCommentRequest,
  UserFriendRequest,
  GetWithPaging,
  SendMessageRequest,
  GetConversationDetailRequest,
  GetConversationMessagesRequest,
  GetDirectConversationsRequest,
} from "./request";

// Response
export type {
  LoginResponse,
  RegisterResponse,
  PostCreateResponse,
  GetPostsByUserResponse,
  LikePostResponse,
  PostUpdateResponse,
  CommentOnPostResponse,
  GetCommentsByPostResponse,
  GetCommentsByCommentResponse,
  LikeCommentResponse,
  UpdateCommentResponse,
  NotificationDetail,
  GetNotificationsByUserResponse,
  GetUserInfoResponse,
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
