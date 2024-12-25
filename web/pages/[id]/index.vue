<template>
  <div>
    <div>
      <USkeleton class="h-40 w-full" />
      <div class="relative flex justify-between items-center pl-36 pr-3 py-4">
        <div
          class="h-28 w-28 p-1 bg-white rounded-full absolute -top-14 left-6"
        >
          <UAvatar
            :src="user?.avatar || currentUser.avatar"
            size="3xl"
            class="h-full w-full"
            :ui="{ size: { '3xl': 'h-full w-full' } }"
          />
        </div>
        <div class="text-2xl">
          {{
            user
              ? `${user.firstName} ${user.lastName}`
              : `${currentUser.firstName} ${currentUser.lastName}`
          }}
        </div>
        <UButton v-if="!isCurrentUser" :icon="addFriendBtn.icon">
          {{ addFriendBtn.label }}
        </UButton>
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
            :user="user || currentUser"
            :is-current-user="isCurrentUser"
          />
        </template>
        <template #information="{ item }">{{ item.label }}</template>
        <template #friends="{ item }">{{ item.label }}</template>
      </UTabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icons from "~/common/constants/icons";
import type { GetUserInfoResponse, UserSchema } from "~/common/interfaces";

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
const userId = useRoute().params.id;

const { $api } = useNuxtApp();

const user = ref<UserSchema>();

const { user: currentUser } = storeToRefs(useAuth());
const isCurrentUser = computed(() => currentUser.value._id === userId);
const isFriend = computed(() =>
  user?.value?.friends.includes(currentUser.value._id)
);
const isWaitingForAcceptFriendRequest = computed(() =>
  user?.value?.friendRequests.includes(currentUser.value._id)
);
const addFriendBtn = computed((): { icon: string; label: string } =>
  isFriend.value
    ? { icon: Icons.personCheck, label: "Friend" }
    : isWaitingForAcceptFriendRequest.value
    ? { icon: Icons.personArrow, label: "Sent friend request" }
    : { icon: Icons.personAdd, label: "Add friend" }
);

onBeforeMount(async () => {
  if (!isCurrentUser) {
    try {
      const response = await $api<GetUserInfoResponse>(`user/${userId}`, {
        method: "get",
      });

      if (!response?.success) {
        showError(response?.error || "");
        return;
      }
      user.value = response.data;
    } catch (error) {
      showError(error.message);
    }
  }
});
</script>
