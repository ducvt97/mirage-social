export interface UserSchema {
  _id: string;
  email: string;
  avatar: string;
  firstName: string;
  lastName: string;
  dob: string;
  friends: string[];
  posts: string[];
}
