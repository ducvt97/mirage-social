<template>
  <UDropdown
    :items="notifications"
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
      :text="unreadNotifications.length"
      :show="unreadNotifications.length > 0"
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
        <div class="text-lg font-bold">Notifications</div>
        <UButton variant="ghost" @click="markAllNotificationsRead">
          {{ item.label }}
        </UButton>
      </div>
    </template>
    <template #item="{ item }">
      <AppMessageItem
        :name="item.icon"
        :message="item.label"
        :avatar="item.avatar.src"
      />
    </template>
    <template #empty="{ item }">
      <div class="text-center cursor-text -mt-5 pb-3">{{ item.label }}</div>
    </template>
  </UDropdown>
</template>

<script setup lang="ts">
import { io } from "socket.io-client";
import type { DropdownItem } from "#ui/types";
import Icons from "~/common/constants/icons";
import type {
  GetUserConversationsResponse,
  NotificationDetail,
} from "~/common/interfaces/response";
import { NotificationType } from "~/common/constants/enums";
import { AppMessageItem } from "#build/components";
import type { ConversationDetail } from "~/common/interfaces";

// Composables
const { $config } = useNuxtApp();
const { showNotification } = useToastMessage();
const { user } = storeToRefs(useAuth());

// States
const notifications = reactive<DropdownItem[][]>([
  [
    {
      label: "Mark all as read",
      slot: "header",
      disabled: true,
    },
  ],
  [],
  [],
]);
const isLoadingNotifications = ref(false);

// Computed
const unreadNotifications = computed(() =>
  notifications[1].filter((item) => item.iconClass !== "true")
);

// Constants
const notificationEmpty = [
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
    await loadNotifications();
    connectSocket(pushNotification);
  }
});

// Watcher
watchEffect(() => {
  if (notifications[1].length > 0) {
    notifications[2] = [];
  } else {
    notifications[2] = notificationEmpty;
  }
});

watchEffect(() => {
  if (!user) {
    disconnectSocket();
  }
});

// Methods
const connectSocket = (pushNotification: Function) => {
  socket.on("notification", (notification: NotificationDetail) => {
    pushNotification(notification);
  });
  return socket;
};

const disconnectSocket = () => {
  socket.on("disconnect", () => {
    console.log(socket.id);
  });
};

const pushNotification = async (notification: NotificationDetail) => {
  const index = notifications[1].findIndex(
    (item) => item.class === notification._id
  );

  if (index > -1) {
    notifications[1].splice(index, 1);
  }
  await nextTick();
  const notificationItem = convertNotificationToDropdownItem(notification);
  notifications[1].unshift(notificationItem);

  const label =
    notification.type === NotificationType.LIKE_POST
      ? `like your post: ${notification.postDetails.caption}`
      : notification.type === NotificationType.LIKE_COMMENT
      ? `liked your comment: ${notification.commentDetails?.caption}`
      : notification.type === NotificationType.COMMENT_POST
      ? `has commented on your post: ${notification.postDetails.caption}`
      : notification.type === NotificationType.REPLY_COMMENT
      ? `has replied your comment: ${notification.commentDetails?.caption}`
      : "System notification";
  const message = `${notificationItem.labelClass} ${label}`;
  showNotification(message);
};

const loadNotifications = async () => {
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
        notifications[1].push(convertNotificationToDropdownItem(conversation));
      }
    }
  } catch (error) {
    showError(error.message);
  } finally {
    isLoadingNotifications.value = false;
  }
};

const markAllNotificationsRead = async () => {};

const convertNotificationToDropdownItem = (
  notification: ConversationDetail
): DropdownItem => {
  const label =
    notification.type === NotificationType.LIKE_POST
      ? notification.postDetails.likes > 1
        ? `and ${
            notification.postDetails.likes - 1
          } other people like your post: "${notification.postDetails.caption}"`
        : `like your post: ${notification.postDetails.caption}`
      : notification.type === NotificationType.LIKE_COMMENT &&
        notification.commentDetails
      ? notification.commentDetails.likes > 1
        ? `and ${
            notification.commentDetails.likes - 1
          } people like your comment: ${notification.commentDetails.caption}`
        : `like your comment: ${notification.commentDetails.caption}`
      : notification.type === NotificationType.COMMENT_POST
      ? `has commented on your post: ${notification.postDetails.caption}`
      : notification.type === NotificationType.REPLY_COMMENT
      ? `has replied your comment: ${notification.commentDetails?.caption}`
      : "System notification";
  const icon =
    notification.type === NotificationType.LIKE_POST ||
    notification.type === NotificationType.LIKE_COMMENT
      ? Icons.like
      : notification.type === NotificationType.COMMENT_POST ||
        notification.type === NotificationType.REPLY_COMMENT
      ? Icons.comment
      : Icons.logo;
  const userFullname = `${notification.userActionDetails.firstName} ${notification.userActionDetails.lastName}`;

  return {
    label,
    icon,
    to: `/post/${notification.postId}`,
    avatar: { src: notification.userActionDetails.avatar },
    labelClass: userFullname, // User fullname
    class: notification._id, // Notification id
    iconClass: String(notification.read), // read status
  };
};
</script>
