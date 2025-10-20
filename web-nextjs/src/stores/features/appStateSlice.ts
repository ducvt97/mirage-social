import { UserSchema } from "@/interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AppState = {
  isLoading: boolean;
};

const initialState: AppState = {
  isLoading: false,
};

export const appStateSlice = createSlice({
  name: "appState",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    startProgress: (state) => {
      state.isLoading = true;
    },
    stopProgress: (state) => {
      state.isLoading = false;
    },
  },
});

export const { startProgress, stopProgress } = appStateSlice.actions;
export default appStateSlice.reducer;
