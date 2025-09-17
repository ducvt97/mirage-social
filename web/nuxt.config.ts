// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/apollo",
  ],
  css: ["~/assets/styles/main.scss"],
  dev: true,
  runtimeConfig: {
    public: {
      serverEndpoint: process.env.NUXT_SERVER_ENDPOINT,
    },
  },
});
