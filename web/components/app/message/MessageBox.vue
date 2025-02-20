<template>
  <UCard>
    <template #header>
      <ModalHeader :title="conversationInfo.name" @on-close="closeBox" />
    </template>

    <div class="flex flex-row">
      <div v-if="isNewConversation">No messages in this chat.</div>
      <div v-if="showErrorLoadMessage">Failed to load messages.</div>
      <div
        v-for="item in messageList"
        :key="item._id"
        class="flex gap-3 items-center w-2/3"
      >
        <UAvatar size="md" :src="conversationInfo.avatar" />
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
</template>

<script setup lang="ts">
import type {
  ConversationSchema,
  GetConversationDetailRequest,
  GetConversationDetailResponse,
  GetConversationMessagesRequest,
  GetConversationMessagesResponse,
  GetDirectConversationsRequest,
  MessageSchema,
  UserSchema,
} from "~/common/interfaces";

// Props
interface Props {
  conversationId: string;
  avatar?: string;
  name?: string;
}
const props = defineProps<Props>();
const { updateMessageBoxId, closeMessageBox } = useMessageBox();

// States
const conversationInfo = ref<ConversationSchema>({
  _id: props.conversationId,
  avatar: props.avatar || "https://avatars.githubusercontent.com/u/739984?v=4",
  name: props.name || "New message",
  isGroup: false,
  members: [],
});
const membersInfo = ref<UserSchema[]>([]);
const message = ref<string>("");
const messageList = reactive<MessageSchema[]>([]);
const showErrorLoadMessage = ref(false);
const isAllMessageLoaded = ref(false);

// Computed
const page = computed<number>(() => Math.floor(messageList.length / 20));
const isNewConversation = computed<boolean>(() =>
  conversationInfo.value._id.includes("new_")
);

// Life-cycles
onMounted(() => {
  if (isNewConversation.value) {
    const receiverId = conversationInfo.value._id.replace("new_", "");
    getDirectConversation(receiverId);
  } else {
    loadConversationDetail();
    loadMessages();
  }
});

// Methods
const getDirectConversation = async (receiverId: string) => {
  try {
    const query: GetDirectConversationsRequest = { receiverId };
    const res = await useApiClient<GetConversationDetailResponse>(
      "message/getDirectConversations",
      "get",
      { query }
    );

    if (!res?.success) {
      return;
    }

    if (!res.data) {
      updateMessageBoxId("new", "new_" + receiverId);
      return;
    }

    const { conversation, membersDetail } = res.data;
    conversationInfo.value = conversation;
    membersInfo.value = membersDetail;

    await nextTick();
    loadMessages();
  } catch (error) {
    showErrorLoadMessage.value = true;
  }
};

const loadConversationDetail = async () => {
  try {
    const query: GetConversationDetailRequest = {
      conversationId: conversationInfo.value._id,
    };
    const res = await useApiClient<GetConversationDetailResponse>(
      "message/getConversationDetail",
      "get",
      { query }
    );

    if (!res?.success || !res.data) {
      return;
    }

    const { conversation, membersDetail } = res.data;
    conversationInfo.value = conversation;
    membersInfo.value = membersDetail;
  } catch (error) {
    showErrorLoadMessage.value = true;
  }
};

const loadMessages = async () => {
  try {
    const query: GetConversationMessagesRequest = {
      conversationId: conversationInfo.value._id,
      page: page.value,
    };
    const res = await useApiClient<GetConversationMessagesResponse>(
      "message/getConversationMessages",
      "get",
      { query }
    );

    if (!res?.success) {
      showErrorLoadMessage.value = true;
      return;
    }

    showErrorLoadMessage.value = false;

    if (!res.data?.length) {
      isAllMessageLoaded.value = true;
      return;
    }

    messageList.unshift(...(res.data || []));
  } catch (error) {
    showErrorLoadMessage.value = true;
  }
};

const closeBox = () => {
  closeMessageBox(conversationInfo.value._id);
};
</script>
