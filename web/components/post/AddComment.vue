<template>
  <div class="flex gap-3">
    <UAvatar
      size="md"
      :src="user.avatar || 'https://avatars.githubusercontent.com/u/739984?v=4'"
    />
    <div class="flex gap-3 items-center w-full">
      <UTextarea
        autofocus
        class="w-full"
        v-model="caption"
        :rows="3"
        placeholder="Write your comment."
      />
      <UButton
        variant="ghost"
        :icon="Icons.send"
        :disabled="!caption"
        @click="onClickAddComment"
      >
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icons from "~/common/constants/icons";
import type {
  CommentOnPostRequest,
  CommentOnPostResponse,
  CommentSchema,
} from "~/common/interfaces";

interface Props {
  postId: string;
  replyCommentId?: string;
}

const props = defineProps<Props>();
const { postId, replyCommentId } = toRefs(props);

const emit = defineEmits<{
  (e: "addCommentSuccess", comment: CommentSchema): void;
}>();

const { user } = storeToRefs(useAuth());
const { showError } = useToastMessage();
const { startProgress, endProgress } = useLoading();

const caption = ref("");

const onClickAddComment = async () => {
  const body: CommentOnPostRequest = {
    caption: caption.value,
    postId: postId.value,
    replyCommentId: replyCommentId.value,
  };
  try {
    startProgress();

    const res = await useApiClient<CommentOnPostResponse>("post", "post", {
      body,
    });

    if (!res?.success) {
      showError(res?.error || "Server error.");
      return;
    }

    if (res.data) {
      emit("addCommentSuccess", res.data);
    }
  } catch (error) {
    showError(error);
  } finally {
    endProgress();
  }
};
</script>
