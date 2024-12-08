<template>
  <div class="flex gap-3">
    <UAvatar
      size="md"
      :src="user.avatar || 'https://avatars.githubusercontent.com/u/739984?v=4'"
    />
    <div class="w-full">
      <div class="flex gap-3 items-center w-full">
        <UTextarea
          autofocus
          autoresize
          class="w-full"
          v-model="caption"
          :rows="2"
          :maxrows="5"
          placeholder="Write your comment."
          ref="inputRef"
          @blur="onBlur"
        />
        <UButton
          v-if="!isEditMode"
          variant="ghost"
          :icon="Icons.send"
          :disabled="!caption"
          @click="onClickAddComment"
        >
        </UButton>
      </div>
      <div v-if="isEditMode" class="w-full flex justify-end gap-x-3 mt-2">
        <UButton variant="link" size="xs" @click="emit('cancelEdit')">
          Cancel
        </UButton>
        <UButton size="xs" :disabled="!caption" @click="onClickSaveEdit"
          >Save</UButton
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icons from "~/common/constants/icons";
import type {
  CommentOnPostRequest,
  CommentOnPostResponse,
  CommentSchema,
  UpdateCommentRequest,
  UpdateCommentResponse,
} from "~/common/interfaces";
import type { CommentDetail } from "~/common/interfaces/component";

interface Props {
  postId: string;
  updateCommentId?: string;
  updateCaption?: string;
  replyCommentId?: string;
}

const props = defineProps<Props>();
const { postId, updateCommentId, updateCaption, replyCommentId } =
  toRefs(props);

const emit = defineEmits<{
  (e: "addCommentSuccess", comment: CommentDetail): void;
  (e: "cancelEdit"): void;
  (e: "saveEditSuccess", comment: CommentSchema): void;
}>();

const focus = defineModel<boolean>("focus", { default: false });

const { user } = storeToRefs(useAuth());
const { showError } = useToastMessage();
const { startProgress, endProgress } = useLoading();

const inputRef = useTemplateRef("inputRef");

const caption = ref(updateCaption.value || "");

const isEditMode = computed(() => !!updateCommentId.value);

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
      caption.value = "";
    }
  } catch (error) {
    showError(error);
  } finally {
    endProgress();
  }
};

const onClickSaveEdit = async () => {
  const body: UpdateCommentRequest = {
    id: updateCommentId.value ?? "",
    caption: caption.value,
  };

  try {
    startProgress();
    const res = await useApiClient<UpdateCommentResponse>("comment", "patch", {
      body,
    });
    if (!res?.success) {
      showError(res?.error || "");
      return;
    }
    if (res.data) emit("saveEditSuccess", res.data);
  } catch (error) {
    showError(error);
  } finally {
    endProgress();
  }
};

const onBlur = () => (focus.value = false);
</script>
