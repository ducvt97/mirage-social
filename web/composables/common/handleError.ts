const handleError = (response: any): string | undefined => {
  const { logout } = useAuth();
  const { showError } = useToastMessage();
  const { error } = response;

  let serverError = undefined;

  if (error.value) {
    serverError = error.value.cause?.message || "Bad request";
    if (error.value.statusCode === 401) {
      logout();
    } else {
      showError(serverError);
    }
    return serverError;
  }

  return undefined;
};

export { handleError };
