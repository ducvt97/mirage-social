<template>
  <div class="message-box-list">
    <AppMessageBox
      v-for="(item, index) in messageBoxList"
      ref="messageBoxRefs"
      v-show="index < 3"
      :conversation-id="item"
      :key="item"
    />
  </div>
</template>

<script setup lang="ts">
import type { MessageSchema } from "~/common/interfaces";

// Composables
const { messageBoxList } = storeToRefs(useMessageBox());

// Refs
const messageBoxRefs = useTemplateRef("messageBoxRefs");

// Methods
const handleMessageComing = (message: MessageSchema) => {
  if (messageBoxRefs.value) {
    for (const messageBox of messageBoxRefs.value) {
      if (
        messageBox?.conversationId === message.conversationId ||
        messageBox?.conversationId === "new_" + message.senderId
      ) {
        messageBox?.handleMessageComing(message);
        break;
      }
    }
  }
};

// Expose
defineExpose({ handleMessageComing });
</script>

<style scoped>
.message-box-list {
  position: fixed;
  bottom: 400px;
  right: 16px;
  display: flex;
  gap: 0 16px;
  height: 0;
  width: max-content;
  overflow: visible;
  z-index: 1000;
}
</style>
