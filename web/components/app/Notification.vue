<template>
  <UAlert
    variant="outline"
    :title="props.message"
    :icon="icon"
    :color="color"
  />
</template>

<script setup lang="ts">
import Icons from "~/common/constants/icons";

interface Props {
  type?: "success" | "error" | "warning";
  message?: string;
  hasIcon?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: "success",
  message: "Message",
  hasIcon: false,
});

const icon = computed(() => {
  if (!props.hasIcon) {
    return "";
  }

  switch (props.type) {
    case "success":
      return Icons.success;
    case "error":
      return Icons.error;
    case "warning":
      return Icons.warning;
    default:
      break;
  }
});

const color = computed(() => {
  switch (props.type) {
    case "success":
      return "emerald";
    case "error":
      return "red";
    case "warning":
      return "yellow";
    default:
      break;
  }
});
</script>
