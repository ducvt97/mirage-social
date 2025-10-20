import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import appStateReducer from "./features/appStateSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    appState: appStateReducer,
  },
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
