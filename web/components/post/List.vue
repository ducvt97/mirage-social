<template>
  <div v-if="props.loading" class="flex flex-col gap-y-3">
    <div class="flex items-center gap-x-4">
      <USkeleton class="h-10 w-10" :ui="{ rounded: 'rounded-full' }" />
      <div class="w-full">
        <USkeleton class="h-4 w-full max-w-[300px]" />
        <USkeleton class="h-4 w-full max-w-[250px]" />
      </div>
    </div>
    <USkeleton class="h-16 w-full" />
    <USkeleton class="h-8 w-full" />
  </div>
  <div v-else class="flex flex-col gap-4">
    <PostItem
      v-for="item in list"
      :post="item"
      :key="item._id"
      @like-post-success="likePostSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import type { PostDetail } from "~/common/interfaces";

interface Props {
  loading?: boolean;
}
const props = withDefaults(defineProps<Props>(), { loading: true });

const list = defineModel<PostDetail[]>("list", { required: true });

const likePostSuccess = (
  postId: string,
  likes: number,
  usersLike: string[]
) => {
  const index = list.value.findIndex((item) => item._id === postId);
  if (index >= 0) {
    list.value[index].likes = likes;
    list.value[index].usersLike = usersLike;
  }
};
</script>
