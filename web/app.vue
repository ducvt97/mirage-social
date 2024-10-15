<template>
  <div class="w-full h-full">
    <NuxtLayout :name="layout">
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />
  </div>
</template>

<script setup lang="ts">
const isLoggedIn = false;
const layout = computed(() => (isLoggedIn ? "default" : "anonymous"));
</script>
