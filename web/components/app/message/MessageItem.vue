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
    </UChip>
    <div class="line-clamp-2">
      <div v-if="name" class="font-bold mb-1">{{ name }}</div>
      <div>{{ message }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  avatar: string;
  name: string;
  message: string;
}
const props = defineProps<Props>();
const { avatar, name, message } = toRefs(props);
</script>
