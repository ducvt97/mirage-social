<template>
  <div>
    <AppPostItem v-for="item in props.list" :info="item" :key="item._id" />
  </div>
</template>

<script setup lang="ts">
import type { PostSchema } from "~/common/interfaces";

interface Props {
  list: PostSchema[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), { loading: true });
</script>
