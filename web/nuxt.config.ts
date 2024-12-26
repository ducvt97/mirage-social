// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@pinia/nuxt", "pinia-plugin-persistedstate/nuxt"],
  css: ["~/assets/styles/main.scss"],
  dev: true,
  runtimeConfig: {
    public: {
      serverEndpoint: "",
    },
  },
  experimental: { renderJsonPayloads: false },
});
