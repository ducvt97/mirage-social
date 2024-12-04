<template>
  <div v-if="loading" class="flex justify-center w-full">
    <UIcon :name="Icons.loading" class="w-6 h-6" />
  </div>
  <div v-else class="flex flex-col gap-4">
    <PostCommentItem
      v-for="item in list"
      :comment="item"
      :key="item._id"
      @like-comment="likeComment"
    />
  </div>
</template>

<script setup lang="ts">
import Icons from "~/common/constants/icons";
import type { CommentDetail } from "~/common/interfaces/component";

interface Props {
  loading?: boolean;
}
const props = withDefaults(defineProps<Props>(), { loading: false });

const list = defineModel<CommentDetail[]>("list", { required: true });

const likeComment = (commentId: string, likes: number, usersLike: string[]) => {
  const index = list.value.findIndex((item) => item._id === commentId);
  if (index >= 0) {
    list.value[index].likes = likes;
    list.value[index].usersLike = usersLike;
  }
};
</script>
