import { defineStore } from "pinia";
import type { UserCommonInfo } from "~/common/interfaces";

const USER_DEFAULT: UserCommonInfo = {
  _id: "",
  firstName: "",
  lastName: "",
  email: "",
  avatar: "",
};

export const useAuth = defineStore(
  "auth",
  () => {
    const token = ref("");
    const user = ref<UserCommonInfo>(USER_DEFAULT);

    const updateUser = (serverUser: UserCommonInfo) => {
      user.value = serverUser;
    };

    const login = (serverToken: string, serverUser: UserCommonInfo) => {
      token.value = serverToken;
      user.value = serverUser;
    };

    const logout = () => {
      token.value = "";
      user.value = USER_DEFAULT;
    };

    return { token, user, updateUser, login, logout };
  },
  {
    persist: {
      pick: ["token", "user"],
    },
  }
);
