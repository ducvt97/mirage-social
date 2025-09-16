<template>
  <div class="flex flex-wrap gap-4">
    <CardFriend
      v-for="item in friendList"
      :user="item"
      :is-current-user="isCurrentUser"
      @action-success="removeFriendSuccess"
    />
    <AppInfiniteLoading
      :loading="loading"
      :first-fetch="true"
      :disabled-loading="disabledLoading"
      @fetch-data="fetchFriends"
    />
  </div>
</template>

<script setup lang="ts">
import type {
  GetUserFriendsRequest,
  GetUserFriendsResponse,
  UserSchema,
} from "~/common/interfaces";

interface Props {
  user: UserSchema;
  isCurrentUser: boolean;
}
const props = defineProps<Props>();
const { user, isCurrentUser } = toRefs(props);

const { showError } = useToastMessage();

const friendList = reactive<UserSchema[]>([]);
const loading = ref(false);

const pageSize = 20;
const page = computed(() => Math.floor(friendList.length / pageSize));
const disabledLoading = computed(
  () => friendList.length >= user.value.friends.length
);

// Methods
const fetchFriends = async () => {
  loading.value = true;
  try {
    const params: GetUserFriendsRequest = {
      userId: user.value._id,
      page: page.value,
      pageSize,
    };

    const response = await useApiClient<GetUserFriendsResponse>(
      "user/getFriends",
      "get",
      { params }
    );

    if (!response?.success) {
      showError(response?.error || "");
      return;
    }
    const list =
      response.data?.filter(
        (item) => friendList.findIndex((fr) => fr._id === item._id) === -1
      ) || [];
    friendList.push(...list);
  } catch (error) {
    showError(error.message);
  } finally {
    loading.value = false;
  }
};

const removeFriendSuccess = (friendId: string) => {
  const index = friendList.findIndex((item) => item._id === friendId);
  if (index >= 0) {
    friendList.splice(index, 1);
  }
  refetchUser();
};

const refetchUser = inject<Function>("refetchUser", () => {});
</script>
