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
  CommentOnPostRequest,
  GetCommentsByPostRequest,
  GetCommentsByCommentRequest,
  LikeCommentRequest,
  GetWithPaging,
  UpdateCommentRequest,
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
} from "./response";

// Schema
export type { PostSchema, UserSchema, CommentSchema } from "./schema";

// Component
export type { PostDetail } from "./component";

// Properties
export type { ModalProps } from "./properties";
