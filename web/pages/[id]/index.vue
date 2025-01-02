<template>
  <div>
    <USkeleton class="h-40 w-full" />
    <div class="relative flex justify-between items-center pl-36 pr-3 py-4">
      <div class="h-28 w-28 p-1 bg-white rounded-full absolute -top-14 left-6">
        <USkeleton
          v-if="isLoading"
          class="h-full w-full"
          :ui="{ rounded: 'rounded-full' }"
        />
        <UAvatar
          v-else
          :src="user.avatar"
          size="3xl"
          :ui="{ size: { '3xl': 'h-full w-full' } }"
        />
      </div>
      <USkeleton v-if="isLoading" class="h-6 w-48" />
      <div v-else class="text-2xl">
        {{ `${user?.firstName} ${user?.lastName}` }}
      </div>
      <ButtonAddFriend v-if="!isCurrentUser" :friend-id="userId" />
    </div>
    <UDivider class="my-3" />
    <UTabs
      :items="tabs"
      :ui="{
        list: {
          background: 'bg-transparent',
          marker: {
            background: 'bg-transparent',
            base: 'border-b-2 border-primary-500',
            rounded: 'rounded-none',
          },
          tab: {
            size: 'text-base',
            font: '',
            active: 'text-primary-500 font-bold',
            inactive: 'text-black dark:text-white',
          },
        },
      }"
    >
      <template #posts>
        <PageProfilePostsTab
          v-show="!isLoading"
          :user="user"
          :is-current-user="isCurrentUser"
        />
      </template>
      <template #information="{ item }">{{ item.label }}</template>
      <template #friends="{ item }">{{ item.label }}</template>
    </UTabs>
  </div>
</template>

<script setup lang="ts">
import type { GetUserInfoResponse } from "~/common/interfaces";

definePageMeta({ middleware: ["auth"] });

const tabs = [
  {
    slot: "posts",
    label: "Posts",
  },
  {
    slot: "information",
    label: "Information",
  },
  {
    slot: "friends",
    label: "Friends",
  },
];
const userId = useRoute().params.id as string;

const { $api } = useNuxtApp();

const { user: currentUser } = storeToRefs(useAuth());
const user = ref(currentUser.value);
const isLoading = ref(true);
const isCurrentUser = computed(() => currentUser.value._id === userId);

onBeforeMount(async () => {
  try {
    if (!isCurrentUser.value) {
      const response = await $api<GetUserInfoResponse>(`user/${userId}`, {
        method: "get",
      });

      if (!response?.success || !response.data) {
        useError();
        return;
      }
      user.value = response.data;
    }
  } catch (error) {
    showError(error);
  } finally {
    isLoading.value = false;
  }
});
</script>
