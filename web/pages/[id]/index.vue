<template>
  <div>
    <USkeleton class="h-40 w-full" />
    <div class="relative flex justify-between items-center pl-36 pr-3 py-4">
      <div class="h-28 w-28 p-1 bg-white rounded-full absolute -top-14 left-6">
        <!-- <USkeleton
          v-if="isLoading"
          class="h-full w-full"
          :ui="{ rounded: 'rounded-full' }"
        /> -->
        <UAvatar
          :src="user.avatar"
          size="3xl"
          :ui="{ size: { '3xl': 'h-full w-full' } }"
        />
      </div>
      <!-- <USkeleton v-if="isLoading" class="h-6 w-48" /> -->
      <div class="text-2xl">
        {{ `${user?.firstName} ${user?.lastName}` }}
      </div>
      <ButtonAddFriend v-if="!isCurrentUser" :friend-id="params.id as string" />
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
        <LazyPageProfilePostsTab
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
const { params } = toRefs(useRoute());

const { $api } = useNuxtApp();

const { user: currentUser } = storeToRefs(useAuth());
const user = ref(currentUser.value);
const isLoading = ref(true);
const isCurrentUser = computed(() => {
  return currentUser.value._id === params.value.id;
});

watch(isCurrentUser, (newValue) => {
  if (!newValue && !isLoading.value) {
    fetchUser();
  }
});

onBeforeMount(async () => {
  if (!isCurrentUser.value) {
    await fetchUser();
  }
  isLoading.value = false;
});

// Methods
const fetchUser = async () => {
  try {
    if (!isCurrentUser.value) {
      const response = await $api<GetUserInfoResponse>(
        `user/${params.value.id}`,
        {
          method: "get",
        }
      );

      if (!response?.success || !response.data) {
        useError();
        return;
      }
      user.value = response.data;
    }
  } catch (error) {
    showError(error);
  }
};
</script>
