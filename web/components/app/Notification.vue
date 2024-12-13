<template>
  <UDropdown
    :items="notifications"
    :popper="{ placement: 'bottom-end' }"
    :ui="{
      width: 'w-60',
      divide: 'divide-y-0',
      item: { disabled: 'opacity-100' },
    }"
  >
    <UButton
      size="xl"
      variant="soft"
      :icon="Icons.notification"
      :ui="{ rounded: 'rounded-full', icon: { size: { xl: 'h-7 w-7' } } }"
    />
    <template #header="{ item }">
      <div class="flex">
        <div>Notifications</div>
        <UButton variant="ghost" @click="markAllNotificationsRead">
          {{ item.label }}
        </UButton>
      </div>
    </template>
    <template v-if="notifications[1].length" #item="{ item }">
      <AppNotificationItem
        :icon="item.icon"
        :label="item.label"
        :avatar="item.avatar.src"
        :user-fullname="item.labelClass"
      />
    </template>
    <template #empty="{ item }">
      <div class="text-center">{{ item.label }}</div>
    </template>
  </UDropdown>
</template>

<script setup lang="ts">
import { io } from "socket.io-client";
import type { DropdownItem } from "#ui/types";
import Icons from "~/common/constants/icons";
import type {
  GetNotificationsByUserResponse,
  NotificationDetail,
} from "~/common/interfaces/response";
import { NotificationType } from "~/common/constants/enums";

const notifications = reactive<DropdownItem[][]>([
  [
    {
      label: "Mark all as read",
      slot: "header",
      disabled: true,
    },
  ],
  [],
  [
    {
      label: "Your notification list is empty.",
      slot: "empty",
      disabled: true,
    },
  ],
]);
const isLoadingNotifications = ref(false);

const { $config } = useNuxtApp();
const { showNotification } = useToastMessage();
const { user } = storeToRefs(useAuth());

const socket = io(`${$config.public.serverEndpoint}`, {
  query: { userId: user.value._id },
});

onMounted(async () => {
  if (user) {
    await loadNotifications();
    connectSocket(pushNotification);
  }
});

watchEffect(() => {
  if (!user) {
    disconnectSocket();
  }
});

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
      ? `like your post: ${notification.postsDetails.caption}`
      : notification.type === NotificationType.LIKE_COMMENT
      ? `liked your comment: ${notification.commentsDetails?.caption}`
      : notification.type === NotificationType.COMMENT_POST
      ? `has commented on your post: ${notification.postsDetails.caption}`
      : notification.type === NotificationType.REPLY_COMMENT
      ? `has replied your comment: ${notification.commentsDetails?.caption}`
      : "System notification";
  const message = `${notificationItem.labelClass} ${label}`;
  showNotification(message);
};

const loadNotifications = async () => {
  const params = {
    page: 0,
    pageSize: 10,
  };
  try {
    const response = await useApiClient<GetNotificationsByUserResponse>(
      "notification/getByCurrentUser",
      "get",
      { params }
    );

    if (!response?.success) {
      showError(response?.error || "");
      return;
    }

    if (response.data) {
      for (const notification of response.data) {
        notifications[1].push(convertNotificationToDropdownItem(notification));
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
  notification: NotificationDetail
): DropdownItem => {
  const label =
    notification.type === NotificationType.LIKE_POST
      ? notification.postsDetails.likes > 1
        ? `and ${notification.postsDetails.likes - 1} people like your post: ${
            notification.postsDetails.caption
          }`
        : `like your post: ${notification.postsDetails.caption}`
      : notification.type === NotificationType.LIKE_COMMENT &&
        notification.commentsDetails
      ? notification.commentsDetails.likes > 1
        ? `and ${
            notification.commentsDetails.likes - 1
          } people like your comment: ${notification.commentsDetails.caption}`
        : `like your comment: ${notification.commentsDetails.caption}`
      : notification.type === NotificationType.COMMENT_POST
      ? `has commented on your post: ${notification.postsDetails.caption}`
      : notification.type === NotificationType.REPLY_COMMENT
      ? `has replied your comment: ${notification.commentsDetails?.caption}`
      : "System notification";
  const icon =
    notification.type === NotificationType.LIKE_POST ||
    notification.type === NotificationType.LIKE_COMMENT
      ? Icons.like
      : notification.type === NotificationType.COMMENT_POST ||
        notification.type === NotificationType.REPLY_COMMENT
      ? Icons.comment
      : Icons.logo;
  const userFullname = `${notification.usersActionDetails.firstName} ${notification.usersActionDetails.firstName}`;

  return {
    label,
    icon,
    to: `/post/${notification.postId}`,
    avatar: { src: notification.usersActionDetails.avatar },
    labelClass: userFullname, // User fullname
    class: notification._id, // Notification id
  };
};
</script>
