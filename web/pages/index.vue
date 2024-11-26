<template>
  <div>
    <PageHomeCreatePost />
    <PostList :list="postList" :loading="isLoadingPosts" class="mt-4" />
    <!-- Confirm Delete Post Modal -->
    <ModalConfirm
      v-model="isShowDeleteModal"
      content="Do you want to delete this post? This cannot be undone."
      @on-action="deletePost"
      @on-close="postDeleteId = ''"
    />
  </div>
</template>

<script setup lang="ts">
import type {
  DeletePostResponse,
  GetPostsByUserResponse,
  PostDetail,
} from "~/common/interfaces";

definePageMeta({ middleware: ["auth"] });

const { $api } = useNuxtApp();
const { showError } = useToastMessage();
const { startProgress, endProgress } = useLoading();

const postList = ref<PostDetail[]>([]);
const isLoadingPosts = ref(true);
const isShowDeleteModal = ref(false);
const postDeleteId = ref<string>("");

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

const deletePost = async () => {
  try {
    startProgress();
    const res = await useApiClient<DeletePostResponse>(
      `post/${postDeleteId.value}`,
      "delete"
    );

    if (!res?.success) {
      showError(res?.message || "");
      return;
    }

    postList.value = postList.value.filter(
      (item) => item._id !== postDeleteId.value
    );
  } catch (error) {
    showError(error.message);
  } finally {
    endProgress();
  }
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
provide("likePost", likePost);
provide("toggleDeleteModal", toggleDeleteModal);
</script>
