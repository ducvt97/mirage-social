<template>
  <UPopover :items="notifications" :popper="{ placement: 'bottom-end' }">
    <UButton
      size="xl"
      variant="soft"
      :ui="{ rounded: 'rounded-full', icon: { size: { xl: 'h-7 w-7' } } }"
    />
  </UPopover>
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

const notifications = reactive<DropdownItem[][]>([[]]);
const isLoadingNotifications = ref(false);

const { $config } = useNuxtApp();
const { user } = storeToRefs(useAuth());

const socket = io(`${$config.public.serverEndpoint}`, {
  query: { userId: user.value._id },
});

onMounted(async () => {
  if (user) {
    await loadNotifications();
    connectSocket(() => {});
  }
});

watchEffect(() => {
  if (!user) {
    disconnectSocket();
  }
});

const connectSocket = (onNotification: Function) => {
  socket.on("notification", (notification: NotificationDetail) => {
    onNotification(notification);
  });
  return socket;
};

const disconnectSocket = () => {
  socket.on("disconnect", () => {
    console.log(socket.id); // undefined
  });
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
        notifications[0].push(convertNotificationToDropdownItem(notification));
      }
    }
  } catch (error) {
    showError(error.message);
  } finally {
    isLoadingNotifications.value = false;
  }
};

const convertNotificationToDropdownItem = (
  notification: NotificationDetail
): DropdownItem => ({
  label: `${notification}`,
  icon:
    notification.type === NotificationType.LIKE
      ? Icons.like
      : notification.type === NotificationType.COMMENT
      ? Icons.comment
      : Icons.logo,
  to: `/post/${notification.postId}`,
});
</script>
