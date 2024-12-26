<template>
  <div>
    <PageHomeCreatePost @create-success="createPostSuccess" />
    <PostList v-model:list="postList" :loading="isLoadingPosts" class="mt-4" />

    <!-- Create/Edit Post Modal -->
    <ModalCreateUpdatePost
      v-model="isShowEditPostModal"
      :post-detail="postEditing"
      @update-success="updatePostSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import type {
  DeletePostResponse,
  GetPostsByUserRequest,
  GetPostsByUserResponse,
  PostDetail,
  PostSchema,
} from "~/common/interfaces";

definePageMeta({ middleware: ["auth"] });

const { $api } = useNuxtApp();
const { showError } = useToastMessage();
const { startProgress, endProgress } = useLoading();
const { user } = storeToRefs(useAuth());

const postList = reactive<PostDetail[]>([]);
const isLoadingPosts = ref(true);
const isShowEditPostModal = ref(false);
const postEditing = ref<PostDetail | undefined>(undefined);

onBeforeMount(async () => {
  const params: GetPostsByUserRequest = {
    userId: user.value._id,
    page: 0,
    pageSize: 10,
  };
  try {
    const response = await $api<GetPostsByUserResponse>("post/getByUser", {
      method: "get",
      params,
    });

    if (!response?.success) {
      showError(response?.error || "");
      return;
    }

    if (response.data) {
      const { posts } = response.data;
      postList.push(...(posts || []));
    }
  } catch (error) {
    showError(error.message);
  } finally {
    isLoadingPosts.value = false;
  }
});

const createPostSuccess = (post: PostDetail) => {
  postList.unshift(post);
};

const updatePostSuccess = (post: PostSchema) => {
  const index = postList.findIndex((item) => item._id === post._id);
  if (index >= 0) {
    postList[index] = { ...postList[index], ...post };
  }
};

const deletePost = async (postId: string) => {
  try {
    startProgress();
    const res = await useApiClient<DeletePostResponse>(
      `post/${postId}`,
      "delete"
    );

    if (!res?.success) {
      showError(res?.message || "");
      return;
    }

    const index = postList.findIndex((item) => item._id === postId);
    if (index >= 0) {
      postList.splice(index, 1);
    }
  } catch (error) {
    showError(error.message);
  } finally {
    endProgress();
  }
};

const toggleEditPostModal = (isShow: boolean, postId: string) => {
  postEditing.value = postList.find((item) => item._id === postId);
  isShowEditPostModal.value = isShow;
};

provide("toggleEditPostModal", toggleEditPostModal);
provide("deletePost", deletePost);
</script>
