<template>
  <UCard>
    <div class="flex gap-3 items-center">
      <UPopover mode="hover" :popper="{ placement: 'bottom-start' }">
        <ULink :to="`/${post.userDetails._id}`">
          <UAvatar
            size="md"
            :src="
              post.userDetails.avatar ||
              'https://avatars.githubusercontent.com/u/739984?v=4'
            "
          />
        </ULink>
        <template #panel>
          <CardFriendPopover :user="post.userDetails" />
        </template>
      </UPopover>

      <div>
        <UPopover mode="hover" :popper="{ placement: 'bottom-start' }">
          <ULink
            :to="`/${post.userDetails._id}`"
            class="font-semibold hover:underline"
          >
            {{ post.userDetails.firstName }} {{ post.userDetails.lastName }}
          </ULink>
          <template #panel>
            <CardFriendPopover :user="post.userDetails" />
          </template>
        </UPopover>
        <div class="flex items-center text-xs mt-1">
          <AppIcon :name="statusIcon" size="xs" class="mr-1" />
          {{ post.status }}
        </div>
      </div>
      <UDropdown
        class="ml-auto"
        :items="actionItems"
        :popper="{ placement: 'bottom-end' }"
      >
        <UButton variant="ghost" :icon="Icons.more" />
      </UDropdown>
    </div>

    <div class="flex gap-3 items-center mt-3">{{ post.caption }}</div>

    <template #footer>
      <div class="flex justify-between gap-x-4">
        <UButton
          variant="ghost"
          :icon="likeIcon"
          @click="onPressLike"
          :loading="likeLoading"
        >
          {{ post.likes }}
        </UButton>
        <UButton variant="ghost" :icon="Icons.comment" @click="onPressComment">
          Comments
        </UButton>
        <UButton variant="ghost" :icon="Icons.share">Share</UButton>
      </div>
      <div v-if="showCommentPart" class="mt-4">
        <UDivider class="-ml-6 w-[calc(100%+48px)]" />
        <UButton
          class="my-1.5"
          variant="link"
          :loading="getCommentsLoading"
          :disabled="getCommentsLoading"
          @click="loadComments"
        >
          View more replies
        </UButton>
        <PostCommentList
          :loading="getCommentsLoading"
          v-model:list="commentList"
        />
        <div class="h-4" v-if="commentList.length > 0"></div>
        <PostAddUpdateComment
          :post-id="post._id"
          v-model:focus="focusAddComment"
          @add-comment-success="onAddCommentSuccess"
        />
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { PostStatusType } from "~/common/constants/enums";
import Icons from "~/common/constants/icons";
import type {
  BooleanDataResponse,
  GetCommentsByPostRequest,
  GetCommentsByPostResponse,
  LikePostRequest,
  LikePostResponse,
  PostDetail,
} from "~/common/interfaces";
import type { CommentDetail } from "~/common/interfaces/component";

// Props
interface Props {
  post: PostDetail;
}
const props = defineProps<Props>();
const { post } = toRefs(props);

// Emits
const emits = defineEmits<{
  (
    e: "likePostSuccess",
    postId: string,
    likes: number,
    usersLike: string[]
  ): void;
}>();

// Composables
const { user } = useAuth();
const { showError } = useToastMessage();
const { startProgress, endProgress } = useLoading();
const { openModal: openConfirmModal } = useConfirmModal();

// States
const likeLoading = ref(false);
const showCommentPart = ref(false);
const getCommentsLoading = ref(false);
const focusAddComment = ref(false);
const commentList = reactive<CommentDetail[]>([]);
const commentListPage = ref<number>(0);

// Computed
const statusIcon = computed(() =>
  post.value.status === PostStatusType.PUBLIC ? Icons.public : Icons.private
);

const likeIcon = computed(() =>
  post.value.usersLike.includes(user._id) ? Icons.like : Icons.notLike
);

const actionItems = computed(() => [
  [
    {
      label: "Edit",
      icon: Icons.edit,
      click: () => {
        if (toggleEditPostModal) {
          toggleEditPostModal(true, post.value._id);
        }
      },
    },
  ],
  [
    {
      label: "Delete",
      icon: Icons.delete,
      class: "text-red-600",
      iconClass: "text-red-600",
      click: () => {
        if (deletePost) {
          openConfirmModal({
            content: "Do you want to delete this post? This cannot be undone.",
            onAction: () => {
              deletePost(post.value._id);
            },
          });
        }
      },
    },
  ],
]);

// Constants
const pageSize = 10;

// Methods
const loadComments = async () => {
  getCommentsLoading.value = true;
  try {
    const query: GetCommentsByPostRequest = {
      postId: post.value._id,
      page: commentListPage.value,
      pageSize,
    };

    const res = await useApiClient<GetCommentsByPostResponse>(
      "comment/getCommentsByPost",
      "get",
      { query }
    );

    if (!res?.success) {
      showError(res?.error || "");
      return;
    }
    if (res.data) {
      const newCommentList = res.data?.filter((item) => {
        return commentList.find((reply) => reply._id === item._id)
          ? false
          : true;
      });
      commentList.unshift(...(newCommentList || []));

      if (res.data?.length >= pageSize) {
        commentListPage.value++;
      }
    }
  } catch (error) {
    showError(error);
  } finally {
    getCommentsLoading.value = false;
  }
};

const onPressLike = async () => {
  const body: LikePostRequest = { postId: post.value._id };

  try {
    likeLoading.value = true;
    const res = await useApiClient<LikePostResponse>("post/likePost", "post", {
      body,
    });

    if (!res?.success) {
      showError(res?.error || "");
      return;
    }

    if (res.data) {
      const { likes, usersLike } = res.data;
      emits("likePostSuccess", body.postId, likes, usersLike);
    }
  } catch (error) {
    showError(error.message);
  } finally {
    likeLoading.value = false;
  }
};

const deleteComment = async (commentId: string) => {
  try {
    startProgress();
    const res = await useApiClient<BooleanDataResponse>(
      `comment/${commentId}`,
      "delete"
    );

    if (!res?.success) {
      showError(res?.message || "");
      return;
    }

    const index = commentList.findIndex((item) => item._id === commentId);
    if (index >= 0) {
      commentList.splice(index, 1);
    }
  } catch (error) {
    showError(error.message);
  } finally {
    endProgress();
  }
};

const onPressComment = () => {
  // Load comments for the first time
  if (!showCommentPart.value) {
    showCommentPart.value = true;
    loadComments();
  }

  focusAddComment.value = true;
};

const onAddCommentSuccess = (comment: CommentDetail) => {
  commentList.push(comment);
};

// Provides
provide("deleteComment", deleteComment);

// Injects
const toggleEditPostModal = inject<Function>("toggleEditPostModal");
const deletePost = inject<Function>("deletePost");
</script>
