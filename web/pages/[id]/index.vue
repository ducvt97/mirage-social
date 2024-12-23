<template>
  <div>
    <div>
      <USkeleton class="h-40 w-full" />
      <div class="relative flex justify-between items-center pl-36 pr-3 py-4">
        <div
          class="h-28 w-28 p-1 bg-white rounded-full absolute -top-14 left-6"
        >
          <UAvatar
            :src="user.avatar"
            size="3xl"
            class="h-full w-full"
            :ui="{ size: { '3xl': 'h-full w-full' } }"
          />
        </div>
        <div class="text-2xl">
          {{ user.firstName + " " + user.lastName }}
        </div>
        <UButton>Add friend</UButton>
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
          <PageProfilePostsTab />
        </template>
        <template #information="{ item }">{{ item.label }}</template>
        <template #friends="{ item }">{{ item.label }}</template>
      </UTabs>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ["auth"] });
const { user } = storeToRefs(useAuth());

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
</script>
