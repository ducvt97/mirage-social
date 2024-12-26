<template>
  <UModal v-model="isOpen">
    <UCard>
      <template v-if="state.showHeader" #header>
        <slot name="header">
          <ModalHeader
            :title="state.title"
            :show-close-icon="state.showCloseIcon"
            @on-close="onCloseModal"
          />
        </slot>
      </template>

      <slot>
        <div>{{ state.content }}</div>
      </slot>

      <template v-if="state.showFooter" #footer>
        <slot name="footer">
          <ModalFooter
            :btnCancelText="state.btnCancelText"
            :btnActionText="state.btnActionText"
            :disabledBtnAction="state.disabledBtnAction"
            :showBtnCancel="state.showBtnCancel"
            :showBtnAction="state.showBtnAction"
            @on-action="performAction"
            @on-close="onCloseModal"
          />
        </slot>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const { isOpen, state, closeModal } = useConfirmModal();

// Methods
const performAction = async () => {
  if (state.value.onAction) {
    await state.value.onAction();
  }
  closeModal();
};

const onCloseModal = async () => {
  if (state.value.onClose) {
    await state.value.onClose();
  }
  closeModal();
};
</script>
