<template>
  <UCard>
    <template #header>
      <h3 class="text-xl font-bold leading-6 text-gray-900 dark:text-white">
        Create Post
      </h3>
    </template>

    <div class="flex gap-3 items-center">
      <UAvatar
        size="md"
        :src="
          info.avatar || 'https://avatars.githubusercontent.com/u/739984?v=4'
        "
      />
      <div>
        <div class="text-sm font-semibold mb-1">
          {{ user.firstName }} {{ user.lastName }}
        </div>
        <USelect v-model="status" :options="statusList" size="2xs" />
      </div>
    </div>

    <template #footer>Footer</template>
  </UCard>
</template>

<script setup lang="ts">
import type { PostSchema } from "~/common/interfaces";

interface Props {
  info: PostSchema;
}

const props = defineProps<Props>();
const { info } = toRefs(props);
</script>
