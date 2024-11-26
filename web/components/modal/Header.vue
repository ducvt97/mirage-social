<template>
  <div class="flex items-center justify-between">
    <h3 class="text-xl font-bold leading-6 text-gray-900 dark:text-white">
      {{ title }}
    </h3>
    <UButton
      v-if="showCloseIcon"
      color="gray"
      variant="ghost"
      :icon="Icons.close"
      class="-my-1"
      @click="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import Icons from "~/common/constants/icons";

interface ModalProps {
  title?: string;
  showCloseIcon?: boolean;
}

const props = withDefaults(defineProps<ModalProps>(), {
  title: "Modal",
  showCloseIcon: true,
});

const {
  title,
  showCloseIcon,
} = toRefs(props);

const emits = defineEmits<{
  (e: "on-close"): any;
}>();

const closeModal = () => {
  emits("on-close");
};
</script>
