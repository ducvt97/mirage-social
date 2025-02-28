<template>
  <div>
    <UDropdown
      :items="dropdownItems"
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
        <div class="w-full flex flex-col">
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
                @click="openMessageBox('new')"
              />
            </UTooltip>
          </div>
          <div class="w-full mt-1 flex items-center gap-x-2">
            <UButton
              v-show="isSearching"
              size="md"
              variant="ghost"
              :icon="Icons.arrowLeft"
              :ui="{ rounded: 'rounded-full' }"
              @click="isSearching = false"
            />
            <UInput
              v-model.trim="searchText"
              placeholder="Search people"
              class="flex-1"
              @input="searchUser"
              @focus="isSearching = true"
            />
          </div>
          <div v-show="isLoading" class="mt-2">
            <AppIcon :name="Icons.loading" />
          </div>
        </div>
      </template>
      <template v-if="isSearching" #item="{ item }">
        <div class="flex gap-x-3 items-center">
          <UAvatar :src="item.avatar.src" size="lg" />
          <div class="line-clamp-2">
            <div class="font-bold mb-1">{{ item.label }}</div>
          </div>
        </div>
      </template>
      <template v-else #item="{ item }">
        <AppMessageItem
          :message-id="item.class"
          :name="item.label"
          :message="item.labelClass"
          :avatar="item.avatar.src"
        />
      </template>
      <template v-show="!isLoading" #empty="{ item }">
        <div class="w-full text-center cursor-text -mt-5 pb-3">
          {{ item.label }}
        </div>
      </template>
    </UDropdown>
    <AppMessageBoxList ref="messageBoxListRef" />
  </div>
</template>

<script setup lang="ts">
import { io } from "socket.io-client";
import type { DropdownItem } from "#ui/types";
import Icons from "~/common/constants/icons";
import type {
  GetUserConversationByIdResponse,
  GetUserConversationsResponse,
  GetUserInfoResponse,
  SearchUserResponse,
} from "~/common/interfaces/response";
import type {
  ConversationDetail,
  GetConversationDetailRequest,
  MessageSchema,
  SearchRequest,
  UserSchema,
} from "~/common/interfaces";
import { debounce } from "~/common/utils";

// Composables
const { $config } = useNuxtApp();
const { user } = storeToRefs(useAuth());
const { updateUser } = useAuth();
const { openMessageBox } = useMessageBox();

// Refs
const messageBoxListRef = useTemplateRef("messageBoxListRef");

// States
const dropdownItems = reactive<DropdownItem[][]>([
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
const conversationList = reactive<DropdownItem[]>([]);
const searchList = reactive<DropdownItem[]>([]);
const isLoading = ref(false);
const isSearching = ref(false);
const searchText = ref("");

// Computed

// Constants
const conversationEmpty = {
  label: "Your message list is empty.",
  slot: "empty",
  disabled: true,
};
const searchResultsEmpty = {
  label: "No users found.",
  slot: "empty",
  disabled: true,
};
// Socket
const socket = io(`${$config.public.serverEndpoint}`, {
  query: { userId: user.value._id },
});

// Life cycles
onMounted(async () => {
  if (user) {
    dropdownItems[1] = conversationList;
    await loadConversations();
    connectSocket();
  }
});

// Watcher
watchEffect(() => {
  if (dropdownItems[1].length > 0) {
    dropdownItems[2].length = 0;
  } else {
    dropdownItems[2].length = 0;
    dropdownItems[2].push(
      isSearching.value ? searchResultsEmpty : conversationEmpty
    );
  }
});

watchEffect(() => {
  if (!user) {
    disconnectSocket();
  }
});

watch(isSearching, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    if (newValue) {
      dropdownItems[1] = searchList;
    } else {
      dropdownItems[1] = conversationList;
      searchText.value = "";
    }
  }
});

// Methods
const connectSocket = () => {
  socket.on("message", handleMessageComing);
  return socket;
};

const disconnectSocket = () => {
  socket.on("disconnect", () => {
    console.log(socket.id);
  });
};

const loadConversations = async () => {
  isLoading.value = true;
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
        conversationList.push(convertConversationToDropdownItem(conversation));
      }
    }
  } catch (error) {
    showError(error.message);
  } finally {
    isLoading.value = false;
  }
};

const getConversationById = async (conversationId: string) => {
  isLoading.value = true;
  const query: GetConversationDetailRequest = { conversationId };
  try {
    const response = await useApiClient<GetUserConversationByIdResponse>(
      "message/getUserConversationById",
      "get",
      { query }
    );

    if (!response?.success) {
      showError(response?.error || "");
      return;
    }

    return response.data;
  } catch (error) {
    showError(error.message);
  } finally {
    isLoading.value = false;
  }
};

const searchUser = debounce(async () => {
  isLoading.value = true;
  const query: SearchRequest = { searchText: searchText.value };

  try {
    const response = await useApiClient<SearchUserResponse>(
      "user/searchUser",
      "get",
      { query }
    );

    if (!response?.success) {
      showError(response?.error || "");
      return;
    }

    const items = [];
    if (response.data) {
      for (const user of response.data) {
        items.push(convertSearchUserToDropdownItem(user));
      }
    }

    searchList.length = 0;
    searchList.push(...items);
  } catch (error) {
    showError(error.message);
  } finally {
    isLoading.value = false;
  }
}, 500);

const handleMessageComing = async (message: MessageSchema) => {
  if (!message) {
    return;
  }

  fetchUserInfo();

  // Add new message to Opening MessageBox
  messageBoxListRef.value?.handleMessageComing(message);

  // Add new message to Conversation List
  const conversationIndex = conversationList.findIndex(
    (item) => item.class === message.conversationId
  );

  if (conversationIndex === -1) {
    const conversation = await getConversationById(message.conversationId);
    if (conversation) {
      conversationList.unshift(convertConversationToDropdownItem(conversation));
    }
  } else {
    conversationList[conversationIndex].labelClass = message.text;
    if (conversationIndex > 0) {
      const conversation = conversationList.splice(conversationIndex, 1);
      conversationList.unshift(conversation[0]);
    }
  }
};

const fetchUserInfo = async () => {
  const response = await useApiClient<GetUserInfoResponse>(
    `user/${user.value._id}`,
    "get"
  );

  if (!response?.success || !response.data) {
    return;
  }

  updateUser(response.data);
};

const convertConversationToDropdownItem = (
  conversation: ConversationDetail
): DropdownItem => {
  return {
    label: conversation.name,
    avatar: { src: conversation.avatar },
    labelClass: conversation.message?.text || "", // Last message
    class: conversation._id, // Conversation id
    click: () => {
      openMessageBox(conversation._id);
    },
  };
};

const convertSearchUserToDropdownItem = (user: UserSchema): DropdownItem => {
  return {
    label: `${user.firstName} ${user.lastName}`,
    avatar: { src: user.avatar },
    click: () => {
      openMessageBox("new_" + user._id);
    },
  };
};
</script>
