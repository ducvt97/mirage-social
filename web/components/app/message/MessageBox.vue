<template>
  <UCard>
    <template #header>
      <ModalHeader :title="conversationInfo.name" @on-close="closeBox" />
    </template>

    <div class="flex flex-row">
      <div v-show="showErrorLoadMessage">Failed to load messages.</div>
      <div v-for="item in messageList" class="flex gap-3 items-center w-2/3">
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
  MessageSchema,
  UserSchema,
} from "~/common/interfaces";

interface Props {
  conversationId?: string;
  avatar?: string;
  name?: string;
}
const props = defineProps<Props>();
const { closeMessageBox } = useMessageBox();

const conversationInfo = ref<ConversationSchema>({
  _id: props.conversationId || "",
  avatar: props.avatar || "https://avatars.githubusercontent.com/u/739984?v=4",
  name: props.name || "",
  isGroup: false,
  members: [],
});
const membersInfo = ref<UserSchema[]>([]);
const message = ref<string>("");
const messageList = reactive<MessageSchema[]>([]);
const page = ref<number>(0);
const showErrorLoadMessage = ref(false);
const isAllMessageLoaded = ref(false);

onMounted(() => {
  if (props.conversationId) {
    loadConversationDetail();
    loadMessages();
  }
});

const loadConversationDetail = async () => {
  try {
    const query: GetConversationDetailRequest = {
      conversationId: conversationInfo.value._id,
    };
    const res = await useApiClient<GetConversationDetailResponse>(
      "message/getConversationMessages",
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
