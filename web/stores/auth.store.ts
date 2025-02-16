import { defineStore } from "pinia";
import type { UserSchema } from "~/common/interfaces";

const USER_DEFAULT: UserSchema = {
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
};

export const useAuth = defineStore(
  "auth",
  () => {
    const { clearAllOpenMessageBoxes } = useMessageBox();

    const token = ref("");
    const user = ref<UserSchema>(USER_DEFAULT);

    const updateUser = (serverUser: UserSchema) => {
      user.value = serverUser;
    };

    const login = (serverToken: string, serverUser: UserSchema) => {
      token.value = serverToken;
      user.value = serverUser;
    };

    const logout = () => {
      token.value = "";
      user.value = USER_DEFAULT;
      clearAllOpenMessageBoxes();
    };

    return { token, user, updateUser, login, logout };
  },
  {
    persist: {
      pick: ["token", "user"],
    },
  }
);
