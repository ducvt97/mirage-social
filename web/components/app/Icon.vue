<template>
  <UIcon :name="props.name" :class="`${sizeClass} ${iconColor}`" />
</template>

<script setup lang="ts">
interface Props {
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  color?: "primary" | "green" | "blue" | "red";
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
  color: "primary",
});

const sizeClass = computed(() => {
  switch (props.size) {
    case "xs":
      return "w-4 h-4";
    case "sm":
      return "w-5 h-5";
    case "md":
      return "w-6 h-6";
    case "lg":
      return "w-8 h-8";
    case "xl":
      return "w-10 h-10";
    case "2xl":
      return "w-12 h-12";
    default:
      return "w-6 h-6";
  }
});

const iconColor = computed(() => {
  switch (props.color) {
    case "primary":
      return "text-primary-500";
    case "red":
      return "text-red-500";
    case "green":
      return "text-green-500";
    case "blue":
      return "text-cyan-500";
    default:
      return "text-primary-500";
  }
});
</script>
