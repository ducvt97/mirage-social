<template>
  <div>{{ props.info.caption }}</div>
</template>

<script setup lang="ts">
import type { PostSchema } from "~/common/interfaces";

interface Props {
  info: PostSchema;
}

const props = defineProps<Props>();
</script>
