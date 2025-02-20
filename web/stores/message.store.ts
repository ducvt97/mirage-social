import { defineStore } from "pinia";

export const useMessageBox = defineStore(
  "message",
  () => {
    const messageBoxList = reactive<string[]>([]);

    const openMessageBox = (id: string) => {
      const chatIndex = messageBoxList.findIndex((item) => item === id);
      if (chatIndex > 0) {
        messageBoxList.splice(chatIndex);
        messageBoxList.unshift(id);
      }
    };

    const closeMessageBox = (id: string) => {
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

    const updateMessageBoxId = (currentId: string, newId: string) => {
      const openChatIndex = messageBoxList.findIndex(
        (item) => item === currentId
      );
      if (openChatIndex > -1) {
        messageBoxList[openChatIndex] = newId;
      }
    };

    return {
      messageBoxList,
      openMessageBox,
      closeMessageBox,
      clearAllOpenMessageBoxes,
      updateMessageBoxId,
    };
  },
  {
    persist: {
      pick: ["messageBoxList"],
    },
  }
);
