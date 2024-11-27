<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <ModalHeader :title="title" @on-close="closeModal" />
      </template>

      <div class="flex gap-3 items-center">
        <UAvatar
          size="md"
          :src="
            user.avatar || 'https://avatars.githubusercontent.com/u/739984?v=4'
          "
        />
        <div>
          <div class="text-sm font-semibold mb-1">
            {{ user.firstName }} {{ user.lastName }}
          </div>
          <USelect v-model="status" :options="statusList" size="2xs" />
        </div>
      </div>

      <UTextarea
        autofocus
        class="my-3"
        v-model="caption"
        :rows="5"
        placeholder="What are you thinking about?"
      />

      <ModalFooter
        btn-action-text="Post"
        :disabled-btn-action="!caption"
        @on-action="onSubmit"
        @on-close="closeModal"
      />
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { PostStatusType } from "~/common/constants/enums";
import type {
  CreatePostRequest,
  PostDetail,
  PostSchema,
  PostUpdateResponse,
  UpdatePostRequest,
} from "~/common/interfaces";
import type { PostCreateResponse } from "~/common/interfaces";

interface Props {
  postDetail?: PostSchema;
}
const props = defineProps<Props>();
const { postDetail } = toRefs(props);

const emits = defineEmits<{
  (e: "create-success", postDetail: PostDetail): any;
  (e: "update-success", post: PostSchema): any;
  (e: "close"): any;
}>();

const isOpen = defineModel({ required: true, default: false });

const { user } = useAuth();
const { startProgress, endProgress } = useLoading();
const { showError } = useToastMessage();

const caption = ref("");
const status = ref(PostStatusType.PUBLIC);

const isUpdate = computed<boolean>(() => !!postDetail.value);
const title = computed<string>(() =>
  isUpdate.value ? "Edit Post" : "Create Post"
);

const statusList = Object.values(PostStatusType);

watchEffect(() => {
  if (isOpen) {
    caption.value = isUpdate.value ? postDetail.value?.caption || "" : "";
    status.value = isUpdate.value
      ? postDetail.value?.status || PostStatusType.PUBLIC
      : PostStatusType.PUBLIC;
    return;
  }

  caption.value = "";
  status.value = PostStatusType.PUBLIC;
});

const onSubmit = async () => {
  startProgress();

  try {
    if (isUpdate.value) {
      const body: UpdatePostRequest = {
        id: postDetail.value?._id || "",
        caption: caption.value,
        status: status.value,
      };

      const res = await useApiClient<PostUpdateResponse>("post", "patch", {
        body,
      });

      if (!res || !res.success) {
        showError(res?.error!);
        return;
      }

      if (res.data) {
        const post = res.data;
        emits("update-success", post);
      }
    } else {
      const body: CreatePostRequest = {
        caption: caption.value,
        status: status.value,
      };

      const res = await useApiClient<PostCreateResponse>("post", "post", {
        body,
      });

      if (!res || !res.success) {
        showError(res?.error!);
        return;
      }

      if (res.data) {
        const { post, user } = res.data;
        const postDetail: PostDetail = {
          ...post,
          userDetails: user,
        };
        emits("create-success", postDetail);
      }
    }
  } catch (error) {
    showError(error);
  } finally {
    closeModal();
    endProgress();
  }
};

const closeModal = () => {
  emits("close");
  caption.value = "";
  status.value = PostStatusType.PUBLIC;
  isOpen.value = false;
};
</script>
