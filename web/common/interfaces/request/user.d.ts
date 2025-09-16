import { GetWithPaging } from "./common";

export interface UserFriendRequest {
  friendId: string;
}

export interface GetUserFriendsRequest extends GetWithPaging {
  userId: string;
}
