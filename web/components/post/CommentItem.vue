<template>
  <div>
    <div class="flex gap-3 items-center relative">
      <UAvatar
        size="md"
        :src="
          comment.userDetails.avatar ||
          'https://avatars.githubusercontent.com/u/739984?v=4'
        "
      />
      <UAlert
        :title="
          comment.userDetails.firstName + ' ' + comment.userDetails.lastName
        "
        :description="comment.caption"
      />
      <div class="absolute bg-white -bottom-2.5 left-16 flex gap-2">
        <UButton
          variant="link"
          size="2xs"
          :class="likeBtn.class"
          @click="onPressLike"
        >
          {{ likeBtn.text }}
        </UButton>
        <UButton
          v-if="isParentComment"
          variant="link"
          size="2xs"
          @click="onClickReply"
        >
          Reply
        </UButton>
      </div>
    </div>
    <div v-if="isParentComment" class="flex flex-col gap-y-3 mt-1 ml-12">
      <UButton
        variant="link"
        :loading="replyCommentListLoading"
        :disabled="replyCommentListLoading"
        @click="onLoadMoreReply"
      >
        View more replies
      </UButton>
      <PostCommentList
        v-if="replyCommentList.length"
        :list="replyCommentList"
        :loading="false"
      />
      <PostAddComment
        v-if="isShowAddComment"
        v-model:focus="isFocusAddComment"
        :post-id="comment.postId"
        :reply-comment-id="comment._id"
        @add-comment-success="addCommentSuccess"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Icons from "~/common/constants/icons";
import type {
  GetCommentsByCommentRequest,
  GetCommentsByCommentResponse,
  LikeCommentRequest,
  LikeCommentResponse,
} from "~/common/interfaces";
import type { CommentDetail } from "~/common/interfaces/component";

// Props
interface Props {
  comment: CommentDetail;
}
const props = defineProps<Props>();
const { comment } = toRefs(props);

// Emits
const emits = defineEmits<{
  (
    e: "likeCommentSuccess",
    commentId: string,
    likes: number,
    usersLike: string[]
  ): void;
}>();

// Composables
const { user } = useAuth();
const { showError } = useToastMessage();

// Refs
const likeLoading = ref(false);
const isShowAddComment = ref(false);
const isFocusAddComment = ref(false);
const replyCommentList = ref<CommentDetail[]>([]);
const replyCommentListPage = ref(0);
const replyCommentListLoading = ref(false);

// Computed
const isParentComment = computed(() => !comment.value.replyCommentId);
const likeBtn = computed(() =>
  comment.value.usersLike.includes(user._id)
    ? { text: "Liked", class: "font-bold" }
    : { text: "Like", class: "" }
);

// Constants
const pageSize = 10;

// Methods
const onLoadMoreReply = async () => {
  const query: GetCommentsByCommentRequest = {
    commentId: comment.value._id,
    page: replyCommentListPage.value,
    pageSize,
  };

  try {
    replyCommentListLoading.value = true;
    const res = await useApiClient<GetCommentsByCommentResponse>(
      "comment/getCommentsByComment",
      "get",
      { query }
    );

    if (!res?.success) {
      showError(res?.error || "");
      return;
    }

    if (res.data) {
      const newReplyList = res.data.filter((item) => {
        return replyCommentList.value.find((reply) => reply._id === item._id)
          ? false
          : true;
      });
      replyCommentList.value.unshift(...newReplyList);

      if (res.data.length >= pageSize) {
        replyCommentListPage.value++;
      }
    }
  } catch (error) {
    showError(error.message);
  } finally {
    replyCommentListLoading.value = false;
  }
};

const onPressLike = async () => {
  const body: LikeCommentRequest = { commentId: comment.value._id };

  try {
    likeLoading.value = true;
    const res = await useApiClient<LikeCommentResponse>(
      "comment/likeComment",
      "post",
      { body }
    );

    if (!res?.success) {
      showError(res?.error || "");
      return;
    }

    if (res.data) {
      const { likes, usersLike } = res.data;
      emits("likeCommentSuccess", body.commentId, likes, usersLike);
    }
  } catch (error) {
    showError(error.message);
  } finally {
    likeLoading.value = false;
  }
};

const onClickReply = () => {
  isShowAddComment.value = true;
  isFocusAddComment.value = true;
};

const addCommentSuccess = (comment: CommentDetail) => {
  replyCommentList.value.push(comment);
};
</script>
