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
          user.avatar || 'https://avatars.githubusercontent.com/u/739984?v=4'
        "
      />
      <div>
        <div class="text-sm font-semibold mb-1">
          {{ user.firstName }} {{ user.lastName }}
        </div>
        <div>
          <UIcon :name="statusIcon" class="w-3 h-3 mr-1" />{{ post.status }}
        </div>
      </div>
    </div>

    <template #footer>Footer</template>
  </UCard>
</template>

<script setup lang="ts">
import { StatusType } from "~/common/constants/enums";
import Icons from "~/common/constants/icons";
import type { PostSchema, UserSchema } from "~/common/interfaces";

interface Props {
  post: PostSchema;
  user: UserSchema;
}

const props = defineProps<Props>();
const { post, user } = toRefs(props);

const statusIcon = computed(() =>
  post.value.status === StatusType.PUBLIC ? Icons.public : Icons.private
);
</script>
