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
  const reqBody = {
    page: 0,
    pageSize: 10,
  };
  try {
    const response = await useApi<GetPostsByUserResponse>(
      "post/getByCurrentUser",
      "get",
      { body: reqBody }
    );

    if (!response?.success) {
      showError(response?.error!);
      return;
    }

    postList.value = response.data || [];
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
