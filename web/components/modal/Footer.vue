<template>
  <div class="flex justify-end gap-x-3">
    <UButton
      v-if="showBtnCancel"
      type="button"
      variant="ghost"
      @click="closeModal"
    >
      {{ btnCancelText }}
    </UButton>
    <UButton
      v-if="showBtnAction"
      type="button"
      :disabled="disabledBtnAction"
      @click="onClickActionBtn"
    >
      {{ btnActionText }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
interface ModalProps {
  btnCancelClasses?: string;
  btnActionClasses?: string;
  btnCancelText?: string;
  btnActionText?: string;
  disabledBtnAction?: boolean;
  showBtnCancel?: boolean;
  showBtnAction?: boolean;
}

const props = withDefaults(defineProps<ModalProps>(), {
  btnCancelText: "Cancel",
  btnActionText: "OK",
  disabledBtnAction: false,
  showBtnCancel: true,
  showBtnAction: true,
  showCloseIcon: true,
  showHeader: true,
  showFooter: true,
});

const {
  btnCancelText,
  btnActionText,
  disabledBtnAction,
  showBtnCancel,
  showBtnAction,
} = toRefs(props);

const emits = defineEmits<{
  (e: "on-close"): any;
  (e: "on-action"): any;
}>();

const closeModal = () => {
  emits("on-close");
};

const onClickActionBtn = () => {
  emits("on-action");
};
</script>
