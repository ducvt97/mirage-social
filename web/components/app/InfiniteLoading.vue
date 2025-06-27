<template>
  <div class="scroll-container" ref="scrollContainerRef">
    <div v-show="loading" class="loading">Loading...</div>
  </div>
</template>

<script setup lang="ts">
import Icons from "~/common/constants/icons";

interface Props {
  loading: boolean;
  firstFetch?: boolean;
  disabledLoading?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  firstFetch: false,
  disabledLoading: false,
});
const { loading, firstFetch, disabledLoading } = toRefs(props);

const emits = defineEmits<{
  (e: "fetch-data"): Promise<any>;
}>();

// Refs
const scrollContainerRef = useTemplateRef("scrollContainerRef");

const observer = ref<IntersectionObserver | null>(null);

onMounted(async () => {
  const options = {
    root: null, // Use the viewport as the root
    threshold: 1, // Trigger when 100% of the element is visible
  };

  observer.value = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !loading.value && !disabledLoading.value) {
        emits("fetch-data");
      }
    });
  }, options);

  await nextTick();
  // Start observing the target element
  observer.value.observe(scrollContainerRef.value!);

  // If firstFetch is true, emit fetch-data to load initial data
  if (firstFetch.value && !disabledLoading.value) {
    emits("fetch-data");
  }
});

onBeforeUnmount(() => {
  observer.value?.disconnect();
});
</script>

<style lang="scss">
.loading {
  text-align: center;
  padding: 10px;
}
</style>
