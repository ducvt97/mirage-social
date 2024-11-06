<template>
  <div>
    <PageHomeCreatePost />
    <AppPostList :list="postList" :loading="isLoadingPosts" />
  </div>
</template>

<script setup lang="ts">
import type { GetPostsByUserResponse, PostSchema } from "~/common/interfaces";

definePageMeta({ middleware: ["auth"] });

const { showError } = useToastMessage();

const postList = ref<PostSchema[]>([]);
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

const createPostSuccess = (post: PostSchema) => {
  postList.value = [...postList.value, post];
};

provide("createPostSuccess", createPostSuccess);
</script>
