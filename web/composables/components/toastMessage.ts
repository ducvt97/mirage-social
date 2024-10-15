import Icons from "~/common/constants/icons";

export const useToastMessage = () => {
  const toast = useToast();

  const showError = (message: string) => {
    toast.add({
      title: `Error: ${message}`,
      icon: Icons.error,
      color: "red",
    });
  };

  const showWarning = (message: string) => {
    toast.add({
      title: `Warning: ${message}`,
      icon: Icons.warning,
      color: "yellow",
    });
  };

  return { showError, showWarning };
};
