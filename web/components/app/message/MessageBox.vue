<template>
  <div class="flex gap-x-3 items-center">
    <UCard v-show="isShowMessage">
      <template #header>
        <ModalHeader :title="name" @on-close="toggleMessageBox(false)" />
      </template>

      <div class="flex flex-row">
        <div v-for="item in messageList" class="flex gap-3 items-center w-2/3">
          <UAvatar
            size="md"
            :src="
              avatar || 'https://avatars.githubusercontent.com/u/739984?v=4'
            "
          />
          <div class="text-sm font-semibold mb-1">
            {{ item.text }}
          </div>
        </div>
      </div>

      <UTextarea
        autofocus
        class="my-3"
        v-model="message"
        :rows="3"
        placeholder="Type your message here"
      />
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { MessageSchema } from "~/common/interfaces";

interface Props {
  conversationId?: string;
  avatar?: string;
  name?: string;
}
const props = defineProps<Props>();
const { avatar, name } = toRefs(props);

const isShowMessage = ref(true);
const message = ref<string>("");
const messageList = ref<MessageSchema[]>([]);

const toggleMessageBox = (isShow: boolean) => {
  isShowMessage.value = isShow;
};

const closeMessageBox = () => {};
</script>
