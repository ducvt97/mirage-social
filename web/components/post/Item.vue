<template>
  <UCard>
    <div class="flex gap-3 items-center">
      <UAvatar
        size="md"
        :src="
          post.userDetails.avatar ||
          'https://avatars.githubusercontent.com/u/739984?v=4'
        "
      />
      <div>
        <div class="text-sm font-semibold mb-1">
          {{ post.userDetails.firstName }} {{ post.userDetails.lastName }}
        </div>
        <div class="flex items-center text-xs">
          <UIcon :name="statusIcon" class="w-4 h-4 mr-1" />{{ post.status }}
        </div>
      </div>
    </div>

    <div class="flex gap-3 items-center mt-3">{{ post.caption }}</div>

    <template #footer>
      <div class="flex justify-between gap-x-4 mb-4">
        <UButton
          variant="ghost"
          :icon="likeIcon"
          @click="onPressLike"
          :loading="likeLoading"
        >
          {{ post.likes }}
        </UButton>
        <UButton variant="ghost" :icon="Icons.comment">Comments</UButton>
        <UButton variant="ghost" :icon="Icons.share">Share</UButton>
      </div>
      <PostAddComment :post-id="post._id" />
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { StatusType } from "~/common/constants/enums";
import Icons from "~/common/constants/icons";
import type {
  LikePostRequest,
  LikePostResponse,
  PostDetail,
} from "~/common/interfaces";

interface Props {
  post: PostDetail;
}
const props = defineProps<Props>();
const { post } = toRefs(props);

const { user } = useAuth();
const { showError } = useToastMessage();

const likeLoading = ref(false);

const statusIcon = computed(() =>
  post.value.status === StatusType.PUBLIC ? Icons.public : Icons.private
);

const likeIcon = computed(() =>
  post.value.usersLike.includes(user._id) ? Icons.like : Icons.notLike
);

const onPressLike = async () => {
  const body: LikePostRequest = { postId: post.value._id };

  try {
    likeLoading.value = true;
    const res = await useApiClient<LikePostResponse>("post/likePost", "post", {
      body,
    });

    if (!res?.success) {
      showError(res?.error || "");
      return;
    }

    if (likePost && res.data) {
      const { likes, usersLike } = res.data;
      likePost(body.postId, likes, usersLike);
    }
  } catch (error) {
    showError(error.message);
  } finally {
    likeLoading.value = false;
  }
};

const likePost = inject<Function>("likePost");
</script>
