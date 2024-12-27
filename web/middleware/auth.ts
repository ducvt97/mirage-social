import type { GetUserInfoResponse } from "~/common/interfaces";

export default defineNuxtRouteMiddleware(async () => {
  const { $api } = useNuxtApp();
  const { token, logout, updateUser } = useAuth();

  if (!token) {
    return navigateTo("/login");
  } else {
    try {
      const res = await $api<GetUserInfoResponse>("auth/verifyToken", {
        method: "get",
      });
      if (res?.success && res.data) {
        updateUser(res.data);
      }
    } catch (error) {
      if (error.statusCode === 401) {
        logout();
        return navigateTo("/login");
      }
    }
  }
});
