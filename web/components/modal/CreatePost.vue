<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <h3 class="text-xl font-bold leading-6 text-gray-900 dark:text-white">
          Create Post
        </h3>
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

      <div class="flex justify-end">
        <UButton type="button" :disabled="!caption" @click="onSubmit">
          Post
        </UButton>
      </div>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { StatusType } from "~/common/constants/enums";
import type { CreatePostRequest } from "~/common/interfaces";
import type { PostCreateResponse } from "~/common/interfaces";

const isOpen = defineModel({ required: true, default: false });

const { user } = useAuth();
const { startProgress, endProgress } = useLoading();
const { showError } = useToastMessage();

const caption = ref("");
const status = ref(StatusType.PUBLIC);

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

    if (createPostSuccess) {
      createPostSuccess(res.data);
    }

    isOpen.value = false;
  } catch (error) {
    showError(error);
  } finally {
    endProgress();
  }
};

const createPostSuccess = inject<Function>("createPostSuccess");
</script>
