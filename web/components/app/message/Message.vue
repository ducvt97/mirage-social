<template>
  <div>
    <UDropdown
      :items="conversations"
      :popper="{ placement: 'bottom-end' }"
      :ui="{
        width: 'w-80',
        divide: 'divide-y-0',
        item: { disabled: 'opacity-100 cursor-default select-text' },
      }"
    >
      <UChip
        size="2xl"
        inset
        :text="user.unreadConversations.length"
        :show="user.unreadConversations.length > 0"
      >
        <UButton
          size="lg"
          variant="outline"
          :icon="Icons.message"
          :ui="{ rounded: 'rounded-full' }"
        />
      </UChip>

      <template #header="{ item }">
        <div class="w-full flex justify-between items-center">
          <div class="text-lg font-bold">Chats</div>
          <UTooltip
            :text="item.label"
            :popper="{ offsetDistance: 4, placement: 'bottom-end' }"
          >
            <UButton
              size="sm"
              variant="ghost"
              :icon="Icons.edit"
              :ui="{ rounded: 'rounded-full' }"
              @click="openMessageBox()"
            />
          </UTooltip>
        </div>
      </template>
      <template #item="{ item }">
        <AppMessageItem
          :message-id="item.class"
          :name="item.label"
          :message="item.labelClass"
          :avatar="item.avatar.src"
          @click="openMessageBox(item.id)"
        />
      </template>
      <template #empty="{ item }">
        <div class="text-center cursor-text -mt-5 pb-3">{{ item.label }}</div>
      </template>
    </UDropdown>
    <div class="message-box-list">
      <AppMessageBox v-for="item in messageBoxList" :conversation-id="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { io } from "socket.io-client";
import type { DropdownItem } from "#ui/types";
import Icons from "~/common/constants/icons";
import type { GetUserConversationsResponse } from "~/common/interfaces/response";
import type { ConversationDetail, MessageSchema } from "~/common/interfaces";

// Composables
const { $config } = useNuxtApp();
const { user } = storeToRefs(useAuth());
const { messageBoxList } = storeToRefs(useMessageBox());
const { openMessageBox } = useMessageBox();

// States
const conversations = reactive<DropdownItem[][]>([
  [
    {
      label: "New message",
      slot: "header",
      disabled: true,
    },
  ],
  [],
  [],
]);
const isLoadingConversations = ref(false);

// Computed

// Constants
const conversationEmpty = [
  {
    label: "Your message list is empty.",
    slot: "empty",
    disabled: true,
  },
];

// Socket
const socket = io(`${$config.public.serverEndpoint}`, {
  query: { userId: user.value._id },
});

// Life cycles
onMounted(async () => {
  if (user) {
    await loadConversations();
    connectSocket(handleMessageComing);
  }
});

// Watcher
watchEffect(() => {
  if (conversations[1].length > 0) {
    conversations[2] = [];
  } else {
    conversations[2] = conversationEmpty;
  }
});

watchEffect(() => {
  if (!user) {
    disconnectSocket();
  }
});

// Methods
const connectSocket = (handleMessageComing: Function) => {
  socket.on("message", (message: MessageSchema) => {
    handleMessageComing(message);
  });
  return socket;
};

const disconnectSocket = () => {
  socket.on("disconnect", () => {
    console.log(socket.id);
  });
};

const loadConversations = async () => {
  const params = { page: 0 };
  try {
    const response = await useApiClient<GetUserConversationsResponse>(
      "message/getUserConversations",
      "get",
      { params }
    );

    if (!response?.success) {
      showError(response?.error || "");
      return;
    }

    if (response.data) {
      for (const conversation of response.data) {
        conversations[1].push(convertConversationToDropdownItem(conversation));
      }
    }
  } catch (error) {
    showError(error.message);
  } finally {
    isLoadingConversations.value = false;
  }
};

const handleMessageComing = async () => {};

const convertConversationToDropdownItem = (
  conversation: ConversationDetail
): DropdownItem => {
  return {
    label: conversation.name,
    avatar: { src: conversation.avatar },
    labelClass: conversation.message.text, // Last message
    class: conversation._id, // Conversation id
  };
};
</script>

<style scoped>
.message-box-list {
  position: fixed;
  bottom: 72px;
  right: 32px;
  display: flex;
  gap: 0 16px;
  height: 0;
  width: max-content;
  overflow: hidden visible;
}
</style>
