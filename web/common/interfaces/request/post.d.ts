export enum StatusType {
  PUBLIC = "Public",
  PRIVATE = "Private",
}

export interface CreatePostRequest {
  caption: string;
  status: StatusType;
}
