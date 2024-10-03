<template>
  <UIcon :name="props.name" :class="`${sizeClass}`" />
</template>

<script setup lang="ts">
interface Props {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const props = withDefaults(defineProps<Props>(), { size: "md" });

const sizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "w-5 h-5";
    case "md":
      return "w-7 h-7";
    case "lg":
      return "w-9 h-9";
    case "xl":
      return "w-12 h-12";
    default:
      return "w-7 h-7";
  }
});
</script>
