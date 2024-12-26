import type { ConfirmModalProps } from "~/common/interfaces";

const defaultState: ConfirmModalProps = {
  title: "Confirm",
  content: "Do you want to perform this action?",
  btnCancelClasses: "",
  btnActionClasses: "",
  btnCancelText: "Cancel",
  btnActionText: "OK",
  disabledBtnAction: false,
  showBtnCancel: true,
  showBtnAction: true,
  showCloseIcon: true,
  showHeader: true,
  showFooter: true,
};

export const useConfirmModal = () => {
  const isOpen = useState("isConfirmModalOpen", () => false);
  const state = useState<ConfirmModalProps>("confirmState", () => defaultState);

  watchEffect(async () => {
    if (!isOpen.value) {
      setTimeout(() => {
        state.value = defaultState;
      }, 200);
    }
  });

  const openModal = (newState: ConfirmModalProps) => {
    state.value = { ...state.value, ...newState };
    isOpen.value = true;
  };

  const closeModal = () => {
    isOpen.value = false;
  };

  return { isOpen, state, openModal, closeModal };
};
