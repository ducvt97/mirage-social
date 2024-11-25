<template>
  <UCard>
    <template #header>
      <slot name="header">
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
</template>

<script setup lang="ts">
import Icons from "~/common/constants/icons";
import type { ModalProps } from "~/common/interfaces";

const props = withDefaults(defineProps</* @vue-ignore */ModalProps>(), {
  title: "Modal",
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
