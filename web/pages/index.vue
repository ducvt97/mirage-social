<template>
  <div>
    <PageHomeCreatePost />
    <AppPostList :list="postList" :loading="isLoadingPosts" class="mt-4" />
  </div>
</template>

<script setup lang="ts">
import type { GetPostsByUserResponse, PostDetail } from "~/common/interfaces";

definePageMeta({ middleware: ["auth"] });

const { showError } = useToastMessage();

const postList = ref<PostDetail[]>([]);
const isLoadingPosts = ref(true);

onBeforeMount(async () => {
  const params = {
    page: 0,
    pageSize: 10,
  };
  try {
    const response = await useApiClient<GetPostsByUserResponse>(
      "post/getByCurrentUser",
      "get",
      { params }
    );

    if (!response?.success) {
      showError(response?.error!);
      return;
    }

    if (response.data) {
      const { posts } = response.data;
      postList.value = posts || [];
    }
  } catch (error) {
    showError(error);
  } finally {
    isLoadingPosts.value = false;
  }
});

const createPostSuccess = (post: PostDetail) => {
  postList.value = [post, ...postList.value];
};

const likePost = (postId: string, likes: number, usersLike: string[]) => {
  postList.value = postList.value.map((item) =>
    item._id === postId ? { ...item, likes, usersLike } : item
  );
};

provide("createPostSuccess", createPostSuccess);
provide("likePost", likePost);
</script>
