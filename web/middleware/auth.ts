export default defineNuxtRouteMiddleware(async (to, from) => {
  const { $api } = useNuxtApp();
  const { token, logout } = useAuth();

  if (!token) {
    return navigateTo("/login");
  } else {
    try {
      await $api("auth/verifyToken", {
        method: "get",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      if (error.statusCode === 401) {
        logout();
        return navigateTo("/login");
      }
    }
  }
});
