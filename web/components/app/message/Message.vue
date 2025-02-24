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
          <div class="w-full flex items-center gap-x-2">
            <UButton
              v-show="isSearching"
              size="md"
              variant="ghost"
              :icon="Icons.arrowLeft"
              :ui="{ rounded: 'rounded-full' }"
              @click="isSearching = false"
            />
            <UInput
              v-model="searchText"
              placeholder="Search people"
              class="flex-1"
              :loading="isLoading"
              @input="searchUser"
              @focus="isSearching = true"
            />
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
      <template #empty="{ item }">
        <div class="text-center cursor-text -mt-5 pb-3">{{ item.label }}</div>
      </template>
    </UDropdown>
    <div class="message-box-list">
      <AppMessageBox
        v-for="(item, index) in messageBoxList"
        v-show="index < 3"
        :conversation-id="item"
        :key="item"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { io } from "socket.io-client";
import type { DropdownItem } from "#ui/types";
import Icons from "~/common/constants/icons";
import type {
  GetUserConversationsResponse,
  SearchUserResponse,
} from "~/common/interfaces/response";
import type {
  ConversationDetail,
  MessageSchema,
  SearchRequest,
  UserSchema,
} from "~/common/interfaces";
import { debounce } from "~/common/utils";

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
const isLoading = ref(false);
const isSearching = ref(false);
const searchText = ref("");

// Computed

// Constants
let itemsCachedData: DropdownItem[] = [];
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
    await loadConversations();
    connectSocket(handleMessageComing);
  }
});

// Watcher
watchEffect(() => {
  if (conversations[1].length > 0) {
    conversations[2].length = 0;
  } else {
    conversations[2].length = 0;
    conversations[2].push(
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
      itemsCachedData = [...conversations[1]];
      conversations[1].length = 0;
    } else {
      conversations[1] = [...itemsCachedData];
      itemsCachedData = [];
      searchText.value = "";
    }
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
        conversations[1].push(convertConversationToDropdownItem(conversation));
      }
    }
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

    const dropdownItems = [];
    if (response.data) {
      for (const user of response.data) {
        dropdownItems.push(convertSearchUserToDropdownItem(user));
      }
    }

    conversations[1] = dropdownItems;
  } catch (error) {
    showError(error.message);
  } finally {
    isLoading.value = false;
  }
}, 500);

const handleMessageComing = async () => {};

const convertConversationToDropdownItem = (
  conversation: ConversationDetail
): DropdownItem => {
  return {
    label: conversation.name,
    avatar: { src: conversation.avatar },
    labelClass: conversation.message.text, // Last message
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
