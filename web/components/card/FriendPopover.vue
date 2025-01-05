<template>
  <div class="w-80 p-3">
    <div class="flex w-full">
      <ULink :to="`/${user._id}`">
        <UAvatar
          size="md"
          :src="
            user.avatar ||
            'https://avatars.githubusercontent.com/u/739984?v=4'
          "
        />
      </ULink>

      <div class="flex-1">
        <ULink
          :to="`/${user._id}`"
          class="font-semibold"
        >
          {{ user.firstName }} {{ user.lastName }}
        </ULink>
        <div class="flex items-center text-xs mt-1">
          sdsdfsdfdsfdsfdsf
        </div>
      </div>
    </div>
    <div class="flex w-full gap-x-4">
      <ButtonAddFriend :friend-id="user._id" />
      <UButton label="Message" :icon="Icons.message" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Icons from "~/common/constants/icons";
import type { UserSchema } from "~/common/interfaces";

interface Props {
  user: UserSchema;
}

const props = defineProps<Props>();
</script>
