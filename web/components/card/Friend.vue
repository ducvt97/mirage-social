<template>
  <div
    class="flex items-center gap-x-3 w-full md:w-1/2 p-2 rounded-lg border border-gray-200"
  >
    <ULink :to="`/${user._id}`">
      <UAvatar
        size="md"
        :src="
          user.avatar || 'https://avatars.githubusercontent.com/u/739984?v=4'
        "
      />
    </ULink>

    <ULink :to="`/${user._id}`" class="font-semibold">
      {{ user.firstName }} {{ user.lastName }}
    </ULink>
    <UDropdown
      v-if="isCurrentUser"
      class="ml-auto"
      :items="actionItems"
      :popper="{ placement: 'bottom-end' }"
    >
      <UButton variant="ghost" :icon="Icons.more" />
    </UDropdown>
  </div>
</template>

<script setup lang="ts">
import Icons from "~/common/constants/icons";
import type {
  BooleanDataResponse,
  UserFriendRequest,
  UserSchema,
} from "~/common/interfaces";
const { openModal: openConfirmModal } = useConfirmModal();

interface Props {
  user: UserSchema;
  isCurrentUser: boolean;
}
const props = defineProps<Props>();
const { user, isCurrentUser } = toRefs(props);

const emits = defineEmits<{
  (e: "action-success", postId: string): any;
}>();

const { startProgress, endProgress } = useLoading();

const actionItems = computed(() => [
  [
    {
      label: "Remove friend",
      icon: Icons.personCancel,
      class: "text-red-600",
      iconClass: "text-red-600",
      click: () => {
        openConfirmModal({
          content: `Are you sure you want to unfriend ${user.value.firstName} ${user.value.lastName}?`,
          onAction: () => {
            execAction("unfriend");
          },
        });
      },
    },
  ],
]);

const execAction = async (actionUrl: string) => {
  try {
    startProgress();
    const reqBody: UserFriendRequest = {
      friendId: user.value._id,
    };

    await useApiClient<BooleanDataResponse>(`user/${actionUrl}`, "post", {
      body: reqBody,
    });
    await emits("action-success", user.value._id);
  } catch (error) {
    showError(error);
  } finally {
    endProgress();
  }
};
</script>
