<template>
  <UCard>
    <div class="flex gap-3 items-center">
      <UAvatar
        size="md"
        :src="
          post.userDetails.avatar ||
          'https://avatars.githubusercontent.com/u/739984?v=4'
        "
      />
      <div>
        <div class="text-sm font-semibold mb-1">
          {{ post.userDetails.firstName }} {{ post.userDetails.lastName }}
        </div>
        <div class="flex items-center text-xs">
          <UIcon :name="statusIcon" class="w-4 h-4 mr-1" />{{ post.status }}
        </div>
      </div>
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
        <PostCommentList :loading="getCommentsLoading" :list="commentList" />
        <div class="h-4" v-if="commentList.length > 0"></div>
        <PostAddComment
          :post-id="post._id"
          :focus="focusAddComment"
          @add-comment-success="onAddCommentSuccess"
          @on-blur="onFocusOutAddComment"
        />
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { StatusType } from "~/common/constants/enums";
import Icons from "~/common/constants/icons";
import type {
  GetCommentsByPostRequest,
  GetCommentsByPostResponse,
  LikePostRequest,
  LikePostResponse,
  PostDetail,
} from "~/common/interfaces";
import type { CommentDetail } from "~/common/interfaces/component";

interface Props {
  post: PostDetail;
}
const props = defineProps<Props>();
const { post } = toRefs(props);

const { user } = useAuth();
const { showError } = useToastMessage();

const likeLoading = ref(false);
const showCommentPart = ref(false);
const getCommentsLoading = ref(false);
const focusAddComment = ref(false);
const commentList = reactive<CommentDetail[]>([]);

const statusIcon = computed(() =>
  post.value.status === StatusType.PUBLIC ? Icons.public : Icons.private
);

const likeIcon = computed(() =>
  post.value.usersLike.includes(user._id) ? Icons.like : Icons.notLike
);

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

    if (likePost && res.data) {
      const { likes, usersLike } = res.data;
      likePost(body.postId, likes, usersLike);
    }
  } catch (error) {
    showError(error.message);
  } finally {
    likeLoading.value = false;
  }
};

const onPressComment = async () => {
  // Load comments for the first time
  if (!showCommentPart.value) {
    showCommentPart.value = true;
    getCommentsLoading.value = true;
    try {
      const query: GetCommentsByPostRequest = {
        postId: post.value._id,
      };

      const res = await useApiClient<GetCommentsByPostResponse>(
        "comment/getCommentsByPost",
        "get",
        { query }
      );

      if (!res?.success) {
        showError(res?.error || "");
      }
      commentList.push(...(res?.data || []));
    } catch (error) {
      showError(error);
    } finally {
      getCommentsLoading.value = false;
    }
  }

  focusAddComment.value = true;
};

const onAddCommentSuccess = (comment: CommentDetail) => {
  commentList.push(comment);
};

const onFocusOutAddComment = () => {
  focusAddComment.value = false;
};

const likePost = inject<Function>("likePost");
</script>
