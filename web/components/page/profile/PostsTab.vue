<template>
  <div>
    <PageHomeCreatePost
      v-if="isCurrentUser"
      @create-success="createPostSuccess"
    />
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
  BooleanDataResponse,
  GetPostsByUserRequest,
  GetPostsByUserResponse,
  PostDetail,
  PostSchema,
  UserSchema,
} from "~/common/interfaces";

interface Props {
  user: UserSchema;
  isCurrentUser: boolean;
}
const props = defineProps<Props>();
const { user, isCurrentUser } = toRefs(props);

const { showError } = useToastMessage();
const { startProgress, endProgress } = useLoading();

const postList = reactive<PostDetail[]>([]);
const isLoadingPosts = ref(false);
const isShowEditPostModal = ref(false);
const postEditing = ref<PostDetail | undefined>(undefined);

const pageSize = 10;
const page = computed(() => Math.floor(postList.length / pageSize));

// Life-cycles
onMounted(() => {
  fetchPosts();
});

// Watcher
watch(user, async (newValue, oldValue) => {
  if (newValue._id !== oldValue._id) {
    postList.length = 0;
    await nextTick();
    await fetchPosts();
  }
});

// Methods
const fetchPosts = async () => {
  isLoadingPosts.value = true;
  try {
    const params: GetPostsByUserRequest = {
      userId: user.value._id,
      page: page.value,
      pageSize,
    };

    const response = await useApiClient<GetPostsByUserResponse>(
      "post/getByUser",
      "get",
      { params }
    );

    if (!response?.success) {
      showError(response?.error || "");
      return;
    }

    if (!response.data) {
      return;
    }

    const { posts } = response.data;
    postList.push(...posts);
  } catch (error) {
    showError(error.message);
  } finally {
    isLoadingPosts.value = false;
  }
};

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
    const res = await useApiClient<BooleanDataResponse>(
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
