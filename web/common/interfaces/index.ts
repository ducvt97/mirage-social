// Common
export type { UserCommonInfo } from "./common";
export type { Error, ServerResponse } from "./server-response";

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
  GetWithPaging,
} from "./request";

// Response
export type {
  LoginResponse,
  RegisterResponse,
  PostCreateResponse,
  GetPostsByUserResponse,
  LikePostResponse,
  DeletePostResponse,
  PostUpdateResponse,
  CommentOnPostResponse,
  GetCommentsByPostResponse,
  GetCommentsByCommentResponse,
  LikeCommentResponse,
  DeleteCommentResponse,
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
export type { ModalProps } from "./properties";
