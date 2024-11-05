<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <h3 class="text-xl font-bold leading-6 text-gray-900 dark:text-white">
          Create Post
        </h3>
      </template>
      <USelect v-model="status" :options="Array(StatusType)" />
      <UTextarea
        v-model="caption"
        :rows="5"
        placeholder="What are you thinking about?"
      />
      <UButton type="button" :disabled="!caption" @click="onSubmit">
        Post
      </UButton>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { StatusType, type CreatePostRequest } from "~/common/interfaces";

const isOpen = defineModel({ required: true, default: false });
const events = defineEmits(["onSuccess"]);

const { startProgress, endProgress } = useLoading();

const caption = ref("");
const status = ref(StatusType.PUBLIC);

const onSubmit = async () => {
  const body: CreatePostRequest = {
    caption: caption.value,
    status: status.value,
  };
  startProgress();

  try {
  } catch (error) {}
  const res = await useApiClient("post", "post", { body });
  if (!res?.success) {
    useToastMessage().showError(res?.error as string);
  }

  endProgress();
};
</script>
