<template>
  <div>
    <div class="flex gap-3 items-center">
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
    </div>
    <div v-if="isParentComment" class="flex flex-col gap-y-4 ml-4">
      <PostCommentList :list="[]" />
      <PostAddComment
        :post-id="comment.postId"
        :reply-comment-id="comment._id"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Icons from "~/common/constants/icons";
import type { LikePostRequest, LikePostResponse } from "~/common/interfaces";
import type { CommentDetail } from "~/common/interfaces/component";

interface Props {
  comment: CommentDetail;
  isParentComment?: boolean;
}
const props = withDefaults(defineProps<Props>(), { isParentComment: true });
const { comment } = toRefs(props);

const { user } = useAuth();
const { showError } = useToastMessage();

const likeLoading = ref(false);

const likeIcon = computed(() =>
  comment.value.usersLike.includes(user._id) ? Icons.like : Icons.notLike
);

const onPressLike = async () => {
  const body: LikePostRequest = { postId: comment.value._id };

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

const likePost = inject<Function>("likePost");
</script>
