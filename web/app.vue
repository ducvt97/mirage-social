<template>
  <div class="w-full h-full">
    <NuxtLayout :name="layout">
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />
    <AppLoading />
    <ModalConfirm />
  </div>
</template>

<script setup lang="ts">
const { user } = useAuth();
const layout = computed(() => (user ? "default" : "anonymous"));
</script>
