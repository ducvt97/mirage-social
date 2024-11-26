<template>
  <UModal v-model="isOpen">
    <UCard>
      <template v-if="showHeader" #header>
        <slot name="header">
          <ModalHeader
            :title="title"
            :show-close-icon="showCloseIcon"
            @on-close="closeModal"
          />
        </slot>
      </template>

      <slot>
        <div>{{ content }}</div>
      </slot>

      <template v-if="showFooter" #footer>
        <slot name="footer">
          <ModalFooter
            :btnCancelText="btnCancelText"
            :btnActionText="btnActionText"
            :disabledBtnAction="disabledBtnAction"
            :showBtnCancel="showBtnCancel"
            :showBtnAction="showBtnAction"
            @on-action="performAction"
            @on-close="closeModal"
          />
        </slot>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
interface ModalProps {
  title?: string;
  content?: string;
  btnCancelClasses?: string;
  btnActionClasses?: string;
  btnCancelText?: string;
  btnActionText?: string;
  disabledBtnAction?: boolean;
  showBtnCancel?: boolean;
  showBtnAction?: boolean;
  showCloseIcon?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
}

// Props
const props = withDefaults(defineProps<ModalProps>(), {
  title: "Confirm",
  content: "Do you want to perform this action?",
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
