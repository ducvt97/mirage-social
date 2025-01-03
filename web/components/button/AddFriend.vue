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
  UserSchema,
} from "~/common/interfaces";

interface Props {
  friend: UserSchema;
}
const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "action-success", newFriend: UserSchema): any;
}>();

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

const { friend } = toRefs(props);
const { user: currentUser } = storeToRefs(useAuth());
const isLoading = ref(false);

const isFriend = computed(() =>
  friend.value.friends.includes(currentUser.value._id)
);
const isSentFriendRequest = computed(() =>
  friend.value.friendRequests.includes(currentUser.value._id)
);
const isWaitingForAcceptFriendRequest = computed(() =>
  friend.value.friendRequestsSent.includes(currentUser.value._id)
);

const execAction = async (actionUrl: string) => {
  try {
    isLoading.value = true;
    const reqBody: UserFriendRequest = {
      friendId: friend.value._id,
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
      `user/${friend.value._id}`,
      "get"
    );

    if (!response?.success) {
      showError(response?.error || "");
      return;
    }

    if (response.data) {
      const user = response.data;
      emit("action-success", user);
    }
  } catch (error) {
    showError(error.message);
  }
};
</script>
