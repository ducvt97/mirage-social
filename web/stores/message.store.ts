import { defineStore } from "pinia";

export const useMessageBox = defineStore(
  "message",
  () => {
    const messageBoxList = reactive<string[]>([]);

    const openMessageBox = (id?: string) => {
      if (!id) {
        id = "new";
      }
      const chatIndex = messageBoxList.findIndex((item) => item === id);
      if (chatIndex > -1) {
        messageBoxList.splice(chatIndex);
      }
      messageBoxList.unshift(id);
    };

    const closeMessageBox = (id?: string) => {
      if (!id) {
        id = "new";
      }
      const openChatIndex = messageBoxList.findIndex((item) => item === id);
      if (openChatIndex !== -1) {
        messageBoxList.splice(openChatIndex, 1);
      }
    };

    const clearAllOpenMessageBoxes = () => {
      if (messageBoxList.length > 0) {
        messageBoxList.length = 0;
      }
    };

    return {
      messageBoxList,
      openMessageBox,
      closeMessageBox,
      clearAllOpenMessageBoxes,
    };
  },
  {
    persist: {
      pick: ["messageBoxList"],
    },
  }
);
