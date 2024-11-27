<template>
  <div
    class="w-full relative overflow-hidden rounded-lg p-4 text-gray-900 dark:text-white bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-800"
  >
    <div class="flex gap-3 items-center">
      <UAvatar
        size="md"
        :src="
          user.avatar || 'https://avatars.githubusercontent.com/u/739984?v=4'
        "
      />
      <UTextarea
        class="w-full"
        :rows="2"
        @click="onClickEdit"
        placeholder="What are you thinking about?"
      />
    </div>
    <ModalCreateUpdatePost v-model="isOpen" />
  </div>
</template>

<script setup lang="ts">
const { user } = useAuth();

const isOpen = ref(false);

const onClickEdit = () => (isOpen.value = true);
</script>
