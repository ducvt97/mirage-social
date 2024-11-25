<template>
  <div>
    <PageHomeCreatePost />
    <PostList :list="postList" :loading="isLoadingPosts" class="mt-4" />
    <ModalConfirm
      v-model="isShowDeleteModal"
      content="Do you want to delete this post? This cannot be undone."
    />
  </div>
</template>

<script setup lang="ts">
import type { GetPostsByUserResponse, PostDetail } from "~/common/interfaces";

definePageMeta({ middleware: ["auth"] });

const { $api } = useNuxtApp();
const { showError } = useToastMessage();

const postList = ref<PostDetail[]>([]);
const isLoadingPosts = ref(true);
const isShowDeleteModal = ref(false);
const postDeleteId = ref("");

onBeforeMount(async () => {
  const params = {
    page: 0,
    pageSize: 10,
  };
  try {
    const response = await $api<GetPostsByUserResponse>(
      "post/getByCurrentUser",
      { method: "get", params }
    );

    if (!response?.success) {
      showError(response?.error || "");
      return;
    }

    if (response.data) {
      const { posts } = response.data;
      postList.value = posts || [];
    }
  } catch (error) {
    showError(error.message);
  } finally {
    isLoadingPosts.value = false;
  }
});

const createPostSuccess = (post: PostDetail) => {
  postList.value = [post, ...postList.value];
};

const deletePostSuccess = (post: PostDetail) => {
  postList.value = postList.value.filter((item) => item._id !== post._id);
};

const likePost = (postId: string, likes: number, usersLike: string[]) => {
  postList.value = postList.value.map((item) =>
    item._id === postId ? { ...item, likes, usersLike } : item
  );
};

const toggleDeleteModal = (isShow: boolean, postId: string) => {
  postDeleteId.value = postId;
  isShowDeleteModal.value = isShow;
};

provide("createPostSuccess", createPostSuccess);
provide("deletePostSuccess", deletePostSuccess);
provide("likePost", likePost);
provide("toggleDeleteModal", toggleDeleteModal);
</script>
