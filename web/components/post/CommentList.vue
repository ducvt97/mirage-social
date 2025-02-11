<template>
  <div v-if="props.loading" class="flex justify-center w-full">
    <AppIcon :name="Icons.loading" />
  </div>
  <div v-else class="flex flex-col gap-4">
    <PostCommentItem
      v-for="item in list"
      :comment="item"
      :key="item._id"
      @like-comment-success="likeCommentSuccess"
      @edit-comment-success="editCommentSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import Icons from "~/common/constants/icons";
import type { CommentSchema, CommentDetail } from "~/common/interfaces";

interface Props {
  loading?: boolean;
}
const props = withDefaults(defineProps<Props>(), { loading: false });

const list = defineModel<CommentDetail[]>("list", { required: true });

const likeCommentSuccess = (
  commentId: string,
  likes: number,
  usersLike: string[]
) => {
  const index = list.value.findIndex((item) => item._id === commentId);
  if (index >= 0) {
    list.value[index].likes = likes;
    list.value[index].usersLike = usersLike;
  }
};

const editCommentSuccess = (comment: CommentSchema) => {
  const index = list.value.findIndex((item) => item._id === comment._id);
  if (index > -1) {
    list.value[index] = { ...list.value[index], ...comment };
  }
};
</script>
