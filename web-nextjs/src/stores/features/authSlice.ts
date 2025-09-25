import type { UserSchema } from "../../interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";

type AuthState = {
  token: string;
  user: UserSchema;
};

const initialState: AuthState = {
  token: "",
  user: {
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    avatar: "",
    dob: "",
    friends: [],
    friendRequests: [],
    friendRequestsSent: [],
    conversations: [],
    unreadConversations: [],
  },
};

export const counterSlice = createSlice({
  name: "auth",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthState>) => {
      state = action.payload;
    },
    logout: (state) => {
      state = { ...initialState };
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    updateUser: (state, action: PayloadAction<UserSchema>) => {
      state.user = { ...action.payload };
    },
  },
});

export const { login, logout, updateUser } = counterSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectToken = (state: RootState) => state.auth.token;
export const selectCurrentUser = (state: RootState) => state.auth.user;

export default counterSlice.reducer;
