export default defineNuxtPlugin((nuxtApp) => {
  const { token } = storeToRefs(useAuth());

  const api = $fetch.create({
    baseURL: nuxtApp.$config.public.serverEndpoint,
    onRequest({ options }) {
      if (token.value) {
        options.headers.set("Authorization", `Bearer ${token.value}`);
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
