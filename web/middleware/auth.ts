export default defineNuxtRouteMiddleware(async (to, from) => {
  const { token } = useAuth();
  if (!token) {
    return navigateTo("/login");
  } else {}
});
