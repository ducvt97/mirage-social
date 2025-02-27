<template>
  <UCard
    class="w-72 h-80 flex flex-col"
    :ui="{
      header: { base: 'h-12', padding: 'py-2' },
      body: { base: 'h-[272px]', padding: 'px-0 py-2' },
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
      <div class="flex flex-col flex-1 px-2 gap-y-0.5 overflow-y-auto">
        <div v-if="isNewConversation && !showErrorLoadMessage">
          No messages in this chat.
        </div>
        <div v-if="showErrorLoadMessage">Failed to load messages.</div>
        <div
          v-for="(item, index) in messageList"
          :key="item._id"
          class="flex gap-x-2 items-center w-2/3"
          :class="{
            'flex-row-reverse self-end': item.senderId === user._id,
            'pl-10':
              item.senderId !== user._id &&
              messageList[index - 1]?.senderId === item.senderId,
            'pr-10':
              item.senderId === user._id &&
              messageList[index - 1]?.senderId === item.senderId,
          }"
        >
          <UAvatar
            v-if="
              index === 0 || messageList[index - 1]?.senderId !== item.senderId
            "
            size="sm"
            :src="item.senderAvatar"
          />
          <div
            class="text-sm rounded-lg border border-primary px-3 py-2 whitespace-break-spaces"
          >
            {{ item.text }}
          </div>
        </div>
      </div>

      <div class="mt-2.5 px-2">
        <UTextarea
          autofocus
          v-model.trim="messageText"
          size="xs"
          :rows="2"
          placeholder="Type your message here"
          @keydown.enter="sendMessage"
        />
      </div>
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
  MessageDetail,
  MessageSchema,
  SendMessageRequest,
  SendMessageResponse,
  UserSchema,
} from "~/common/interfaces";
import { removeLineBreaks } from "~/common/utils";

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
const messageList = reactive<MessageDetail[]>([]);
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
    membersInfo.value = membersDetail;
    setConversationInfo(conversation, membersDetail);

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
    membersInfo.value = membersDetail;
    setConversationInfo(conversation, membersDetail);
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

    const messages: MessageDetail[] = res.data.map((item) => {
      return convertMessageToMessageDetail(item);
    });

    messageList.unshift(...messages);
  } catch (error) {
    showErrorLoadMessage.value = true;
  }
};

const sendMessage = async (event: any) => {
  if (event?.shiftKey) {
    return;
  }

  event.preventDefault();
  if (!messageText.value) {
    return;
  }

  try {
    const text = removeLineBreaks(messageText.value);
    const body: SendMessageRequest = {
      text,
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

    await loadConversationDetail();
    messageList.push(convertMessageToMessageDetail(message));
  } catch (error) {
    showErrorLoadMessage.value = true;
  }
};

const setConversationInfo = (
  conversation: ConversationSchema,
  members: UserSchema[]
) => {
  conversationInfo.value = { ...conversation };
  if (conversation.isGroup) {
    if (!conversation.name) {
      const member = members.find((item) => item._id !== user.value._id);
      if (member) {
        conversationInfo.value.name = `You, ${member.lastName}${
          members.length > 2 && "and " + (members.length - 2) + " other(s)"
        }`;
      }
    }

    if (!conversation.avatar) {
      conversationInfo.value.avatar =
        "https://avatars.githubusercontent.com/u/739984?v=4";
    }
  } else {
    const receiver =
      members.length === 1
        ? members[0]
        : members.find((item) => item._id !== user.value._id);

    if (receiver) {
      conversationInfo.value.name = `${receiver.firstName} ${receiver.lastName}`;
      conversationInfo.value.avatar = receiver.avatar;
    }
  }
};

const handleMessageComing = (message: MessageSchema) => {
  if (message.conversationId === conversationInfo.value._id) {
    messageList.push(convertMessageToMessageDetail(message));
  }
};

const convertMessageToMessageDetail = (message: MessageSchema) => {
  const sender = membersInfo.value.find(
    (item) => item._id === message.senderId
  );

  return {
    ...message,
    senderName: `${sender?.firstName} ${sender?.lastName}`,
    senderAvatar: sender?.avatar,
  };
};

const closeBox = () => {
  closeMessageBox(props.conversationId);
};

defineExpose({ handleMessageComing, conversationId: props.conversationId });
</script>
