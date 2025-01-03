<template>
  <UDropdown
    v-if="isFriend"
    :items="friendActions"
    :popper="{ placement: 'bottom-end' }"
  >
    <UButton
      color="white"
      label="Friend"
      :icon="Icons.personCheck"
      :loading="isLoading"
    />
  </UDropdown>
  <UDropdown
    v-else-if="isWaitingForAcceptFriendRequest"
    :items="replyRequestActions"
    :popper="{ placement: 'bottom-end' }"
  >
    <UButton
      color="white"
      label="Reply request"
      :icon="Icons.personArrowLeft"
      :loading="isLoading"
    />
  </UDropdown>
  <UButton
    v-else-if="isSentFriendRequest"
    label="Waiiting for accept"
    :icon="Icons.personArrowRight"
    :loading="isLoading"
    @click="execAction('undoAddFriend')"
  />
  <UButton
    v-else
    label="Add Friend"
    :icon="Icons.personAdd"
    :loading="isLoading"
    @click="execAction('addFriend')"
  />
</template>

<script setup lang="ts">
import type { DropdownItem } from "#ui/types";
import Icons from "~/common/constants/icons";
import type {
  BooleanDataResponse,
  GetUserInfoResponse,
  UserFriendRequest,
} from "~/common/interfaces";

interface Props {
  friendId: string;
}
const props = defineProps<Props>();

const { updateUser } = useAuth();
const { showError } = useToastMessage();

const friendActions: DropdownItem[][] = [
  [
    {
      label: "Remove friend",
      icon: Icons.personCancel,
      click: () => {
        execAction("unfriend");
      },
    },
  ],
];
const replyRequestActions: DropdownItem[][] = [
  [
    {
      label: "Accept request",
      icon: Icons.personCheck,
      click: () => {
        execAction("acceptFriend");
      },
    },
    {
      label: "Reject request",
      icon: Icons.personCancel,
      click: () => {
        execAction("rejectFriend");
      },
    },
  ],
];

const { friendId } = toRefs(props);
const { user: currentUser } = storeToRefs(useAuth());
const isLoading = ref(false);

const isFriend = computed(() =>
  currentUser.value.friends.includes(friendId.value)
);
const isSentFriendRequest = computed(() =>
  currentUser.value.friendRequestsSent.includes(friendId.value)
);
const isWaitingForAcceptFriendRequest = computed(() =>
  currentUser.value.friendRequests.includes(friendId.value)
);

const execAction = async (actionUrl: string) => {
  try {
    isLoading.value = true;
    const reqBody: UserFriendRequest = {
      friendId: friendId.value,
    };

    const res = await useApiClient<BooleanDataResponse>(
      `user/${actionUrl}`,
      "post",
      { body: reqBody }
    );

    if (!res?.success || !res.data) {
      showError(res?.error || "");
      return;
    }

    await fetchUserInfo();
  } catch (error) {
    showError(error);
  } finally {
    isLoading.value = false;
  }
};

const fetchUserInfo = async () => {
  try {
    const response = await useApiClient<GetUserInfoResponse>(
      `user/${currentUser.value._id}`,
      "get"
    );

    if (!response?.success) {
      showError(response?.error || "");
      return;
    }

    if (response.data) {
      const user = response.data;
      updateUser({
        ...currentUser.value,
        friends: user.friends,
        friendRequests: user.friendRequests,
        friendRequestsSent: user.friendRequestsSent,
      });
    }
  } catch (error) {
    showError(error.message);
  }
};
</script>
