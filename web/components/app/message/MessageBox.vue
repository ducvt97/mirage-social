<template>
  <UCard
    class="w-72 h-80"
    :ui="{
      base: 'flex flex-col',
      header: { padding: 'py-3' },
      body: { base: 'flex-1', padding: 'py-3' },
    }"
  >
    <template #header>
      <div class="flex items-center gap-x-2">
        <UAvatar size="sm" :src="conversationInfo.avatar" />
        <h3
          class="flex-1 text-base font-bold leading-6 text-gray-900 dark:text-white"
        >
          {{ conversationInfo.name }}
        </h3>
        <UButton
          color="gray"
          variant="ghost"
          :icon="Icons.close"
          class="-my-1 -mr-1"
          @click="closeBox"
        />
      </div>
    </template>

    <div class="flex flex-col h-full">
      <div class="flex flex-row flex-1">
        <div v-if="isNewConversation && !showErrorLoadMessage">
          No messages in this chat.
        </div>
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
        class="mt-3"
        v-model.trim="messageText"
        size="xs"
        :rows="2"
        placeholder="Type your message here"
        @keyup.enter="sendMessage"
      />
    </div>
  </UCard>
</template>

<script setup lang="ts">
import Icons from "~/common/constants/icons";
import type {
  ConversationSchema,
  GetConversationDetailRequest,
  GetConversationDetailResponse,
  GetConversationMessagesRequest,
  GetConversationMessagesResponse,
  GetDirectConversationsRequest,
  MessageSchema,
  SendMessageRequest,
  SendMessageResponse,
  UserSchema,
} from "~/common/interfaces";

// Props
interface Props {
  conversationId: string;
  avatar?: string;
  name?: string;
}
const props = defineProps<Props>();
const { closeMessageBox } = useMessageBox();

// States
const conversationInfo = ref<ConversationSchema>({
  _id: props.conversationId,
  avatar: props.avatar || "https://avatars.githubusercontent.com/u/739984?v=4",
  name: props.name || "New message",
  isGroup: false,
  members: [],
});
const membersInfo = ref<UserSchema[]>([]);
const messageText = ref<string>("");
const messageList = reactive<MessageSchema[]>([]);
const showErrorLoadMessage = ref(false);
const isAllMessageLoaded = ref(false);
const { user } = storeToRefs(useAuth());

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

    if (!res?.success || !res.data) {
      return;
    }

    if (!res.data.conversation) {
      if (res.data.membersDetail) {
        const receiver = res.data?.membersDetail.find(
          (item) => item._id === receiverId
        );
        if (receiver) {
          conversationInfo.value.name = `${receiver.firstName} ${receiver.lastName}`;
          conversationInfo.value.avatar = receiver.avatar;
        }
      }
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

const sendMessage = async () => {
  try {
    const body: SendMessageRequest = {
      text: messageText.value,
      ...(isNewConversation.value
        ? { receiverId: conversationInfo.value._id.replace("new_", "") }
        : { conversationId: conversationInfo.value._id }),
    };
    const res = await useApiClient<SendMessageResponse>(
      "message/sendMessage",
      "post",
      { body }
    );

    if (!res?.success || !res.data) {
      showErrorLoadMessage.value = true;
      return;
    }

    showErrorLoadMessage.value = false;

    const { message } = res.data;
    conversationInfo.value._id = message.conversationId;
    messageText.value = "";
    messageList.push(message);
  } catch (error) {
    showErrorLoadMessage.value = true;
  }
};

const closeBox = () => {
  closeMessageBox(conversationInfo.value._id);
};
</script>
