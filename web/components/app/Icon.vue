<template>
  <UIcon :name="props.name" :class="`${sizeClass}`" />
</template>

<script setup lang="ts">
interface Props {
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}

const props = withDefaults(defineProps<Props>(), { size: "md" });

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
</script>
