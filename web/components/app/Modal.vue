<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <slot name="header">
          <div class="flex items-center justify-between">
            <h3
              class="text-xl font-bold leading-6 text-gray-900 dark:text-white"
            >
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
        </slot>
      </template>

      <slot>
        <div>{{ content }}</div>
      </slot>

      <template #footer>
        <slot name="footer">
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
        </slot>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import Icons from "~/common/constants/icons";

interface Props {
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
}
const props = withDefaults(defineProps<Props>(), {
  title: "Modal",
  content: "Do you want to do this action?",
  btnCancelText: "Cancel",
  btnActionText: "OK",
  disabledBtnAction: false,
  showBtnCancel: true,
  showBtnAction: true,
  showCloseIcon: true,
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
} = toRefs(props);

const emits = defineEmits<{
  (e: "on-close"): any;
  (e: "on-action"): any;
}>();

const isOpen = defineModel("is-open", { required: true, default: false });

const closeModal = async () => {
  await emits("on-close");
  isOpen.value = false;
};

const onClickActionBtn = async () => {
  await emits("on-action");
  isOpen.value = false;
};
</script>
