<template>
  <div></div>
  <div v-if="loading" class="flex justify-center w-full">
    <UIcon :name="Icons.loading" class="w-6 h-6" />
  </div>
  <div v-else class="flex flex-col gap-4">
    <PostCommentItem
      v-for="item in props.list"
      :comment="item"
      :key="item._id"
    />
  </div>
</template>

<script setup lang="ts">
import Icons from "~/common/constants/icons";
import type { CommentDetail } from "~/common/interfaces/component";

interface Props {
  list: CommentDetail[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), { loading: true });
</script>
