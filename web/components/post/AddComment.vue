<template>
  <div class="flex gap-3">
    <UAvatar
      size="md"
      :src="user.avatar || 'https://avatars.githubusercontent.com/u/739984?v=4'"
    />
    <div class="flex gap-3 items-center w-full">
      <UTextarea
        :autofocus="true"
        class="w-full"
        v-model="caption"
        :rows="3"
        placeholder="Write your comment."
        ref="inputRef"
        @blur="onBlur"
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
} from "~/common/interfaces";
import type { CommentDetail } from "~/common/interfaces/component";

interface Props {
  postId: string;
  replyCommentId?: string;
}

const props = defineProps<Props>();
const { postId, replyCommentId } = toRefs(props);

const emit = defineEmits<{
  (e: "addCommentSuccess", comment: CommentDetail): void;
}>();

const focus = defineModel("focus", { default: false });

const { user } = storeToRefs(useAuth());
const { showError } = useToastMessage();
const { startProgress, endProgress } = useLoading();

const inputRef = useTemplateRef("inputRef");

const caption = ref("");

watchEffect(() => {
  if (focus.value && inputRef.value?.textarea) {
    inputRef.value.textarea.focus();
  }
});

const onClickAddComment = async () => {
  const body: CommentOnPostRequest = {
    caption: caption.value,
    postId: postId.value,
    replyCommentId: replyCommentId.value,
  };
  try {
    startProgress();

    const res = await useApiClient<CommentOnPostResponse>("comment", "post", {
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

const onBlur = () => (focus.value = false);
</script>
