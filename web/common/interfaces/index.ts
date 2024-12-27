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
} from "./response";

// Schema
export type {
  PostSchema,
  UserSchema,
  CommentSchema,
  NotificationSchema,
} from "./schema";

// Component
export type { PostDetail } from "./component";

// Properties
export type { ModalProps, ConfirmModalProps } from "./properties";
