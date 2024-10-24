export const useLoading = () => {
  const isLoading = useState("loading", () => false);

  const startProgress = () => (isLoading.value = true);

  const endProgress = () => (isLoading.value = false);

  return { isLoading, startProgress, endProgress };
};
