<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold leading-6 text-gray-900 dark:text-white">
            Create Post
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            :icon="Icons.close"
            class="-my-1"
            @click="closeModal"
          />
        </div>
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

      <div class="flex justify-end gap-x-3">
        <UButton type="button" variant="ghost" @click="closeModal">
          Cancel
        </UButton>
        <UButton type="button" :disabled="!caption" @click="onSubmit">
          Post
        </UButton>
      </div>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { StatusType } from "~/common/constants/enums";
import Icons from "~/common/constants/icons";
import type {
  CreatePostRequest,
  PostDetail,
  PostSchema,
} from "~/common/interfaces";
import type { PostCreateResponse } from "~/common/interfaces";

interface Props {
  postDetail?: PostSchema;
}
const { postDetail } = toRefs(defineProps<Props>());

const isOpen = defineModel({ required: true, default: false });

const { user } = useAuth();
const { startProgress, endProgress } = useLoading();
const { showError } = useToastMessage();

const caption = ref(postDetail.value?.caption || "");
const status = ref(postDetail.value?.status || StatusType.PUBLIC);

const statusList = Object.values(StatusType);

const onSubmit = async () => {
  const body: CreatePostRequest = {
    caption: caption.value,
    status: status.value,
  };
  startProgress();

  try {
    const res = await useApiClient<PostCreateResponse>("post", "post", {
      body,
    });

    if (!res || !res.success) {
      showError(res?.error!);
      return;
    }

    if (createPostSuccess && res.data) {
      const { post, user } = res.data;
      const postDetail: PostDetail = {
        ...post,
        userDetails: user,
      };
      createPostSuccess(postDetail);
    }
  } catch (error) {
    showError(error);
  } finally {
    closeModal();
    endProgress();
  }
};

const closeModal = () => {
  caption.value = "";
  status.value = StatusType.PUBLIC;
  isOpen.value = false;
};

const createPostSuccess = inject<Function>("createPostSuccess");
</script>
