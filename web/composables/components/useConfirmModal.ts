import type { ModalProps } from "~/common/interfaces";
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
  onAction: Function,
  onClose: Function,
};

export const useConfirmModal = () => {
  const isOpen = useState("isConfirmModalOpen", () => false);
  const state = useState<ConfirmModalProps>("confirmState", () => defaultState);
  let action = () => {};
  let cancelAction = () => {};

  watchEffect(async () => {
    if (!isOpen.value) {
      setTimeout(() => {
        state.value = defaultState;
        action = () => {};
        cancelAction = () => {};
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

  const setAction = (actionFunction: { (): void }) => {
    action = actionFunction;
  };

  const setCancelAction = (actionFunction: { (): void }) => {
    cancelAction = actionFunction;
  };

  return { isOpen, state, openModal, closeModal, setAction, setCancelAction };
};
