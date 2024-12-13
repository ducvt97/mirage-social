<template>
  <div class="flex gap-x-3 items-center">
    <UChip
      v-if="avatar"
      size="md"
      position="bottom-right"
      inset
      :ui="{ base: '-mx-2 rounded-none ring-0', background: '' }"
    >
      <UAvatar :src="avatar" size="lg" />
      <template #content>
        <AppIcon :name="icon" />
      </template>
    </UChip>
    <AppIcon v-else :name="icon" />
    <div class="line-clamp-2">
      <span v-if="userFullname" class="font-bold">{{ userFullname }} </span>
      {{ label }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { NotificationType } from "~/common/constants/enums";

interface Props {
  avatar?: string;
  userFullname?: string;
  label: string;
  icon: string;
}
const props = defineProps<Props>();
const { avatar, userFullname, label, icon } = toRefs(props);
</script>
