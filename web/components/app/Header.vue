<template>
  <div class="flex justify-between items-center px-6 py-3">
    <ULink to="/" class="h-12">
      <AppIcon :name="Icons.logo" size="2xl" />
    </ULink>
    <div v-if="token" class="flex gap-x-3">
      <AppNotification />
      <UButton @click="onclickLogout">Logout</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icons from "~/common/constants/icons";

const authStore = useAuth();
const { token } = storeToRefs(authStore);
const { logout } = authStore;

const onclickLogout = () => {
  logout();
  navigateTo("/login");
};
</script>
