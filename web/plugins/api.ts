export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const { token } = useAuth();

  const api = $fetch.create({
    baseURL: config.public.serverEndpoint,
    onRequest({ options }) {
      if (token) {
        options.headers.set("Authorization", `Bearer ${token}`);
      }
    },
  });

  // Expose to useNuxtApp().$api
  return {
    provide: {
      api,
    },
  };
});
