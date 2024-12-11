<template>
  <UDropdown :items="notifications" :popper="{ placement: 'bottom-end' }">
    <AppIcon :name="Icons.notification" />
  </UDropdown>
</template>

<script setup lang="ts">
import { io } from "socket.io-client";
import type { DropdownItem } from "#ui/types";
import Icons from "~/common/constants/icons";
import type { NotificationSchema } from "~/common/interfaces";
import type { GetNotificationsByUserResponse } from "~/common/interfaces/response";
import { NotificationType } from "~/common/constants/enums";

const notifications = reactive<DropdownItem[][]>([[], [], []]);
const isLoadingNotifications = ref(false);

const { $api, $config } = useNuxtApp();
const { user } = storeToRefs(useAuth());

const socket = io(`${$config.public.serverEndpoint}`, {
  query: { userId: user.value._id },
});

const setupSocket = (onNotification: Function) => {
  socket.on("notification", (message) => {
    onNotification(message);
  });

  return socket;
};

onBeforeMount(async () => {
  const params = {
    page: 0,
    pageSize: 10,
  };
  try {
    const response = await $api<GetNotificationsByUserResponse>(
      "notification/getByCurrentUser",
      { method: "get", params }
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
});

const convertNotificationToDropdownItem = (
  notification: NotificationSchema
): DropdownItem => ({
  label: `${notification.usersActionNumber}`,
  icon:
    notification.type === NotificationType.LIKE
      ? Icons.like
      : notification.type === NotificationType.COMMENT
      ? Icons.comment
      : Icons.logo,
  to: `/post/${notification.postId}`,
});

onMounted(() => {
  setupSocket(() => {});
});
</script>
