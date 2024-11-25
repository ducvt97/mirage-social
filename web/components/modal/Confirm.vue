<template>
  <UModal v-model="isOpen">
    <AppCardModal
      :title="title"
      :content="content"
      :btnCancelText="btnCancelText"
      :btnActionText="btnActionText"
      :disabledBtnAction="disabledBtnAction"
      :showBtnCancel="showBtnCancel"
      :showBtnAction="showBtnAction"
      :showCloseIcon="showCloseIcon"
      :showHeader="showHeader"
      :showFooter="showFooter"
      @on-action="performAction"
      @on-close="closeModal"
    >
      <!-- <slot></slot> -->
    </AppCardModal>
  </UModal>
</template>

<script setup lang="ts">
import type { ModalProps } from "~/common/interfaces";

// Props
const props = withDefaults(defineProps</* @vue-ignore */ModalProps>(), {
  title: "Confirm",
});
const {
  title,
  content,
  btnCancelText,
  btnActionText,
  disabledBtnAction,
  showBtnCancel,
  showBtnAction,
  showCloseIcon,
  showHeader,
  showFooter,
} = toRefs(props);

// v-model
const isOpen = defineModel({ required: true, default: false });

// Events
const emits = defineEmits<{
  (e: "on-close"): any;
  (e: "on-action"): any;
}>();

// Methods
const performAction = async () => {
  await emits("on-action");
  isOpen.value = false;
};

const closeModal = async () => {
  await emits("on-close");
  isOpen.value = false;
};
</script>
