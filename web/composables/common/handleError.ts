const handleError = (error: any): boolean => {
  const { logout } = useAuth();
  if (error.statusCode === 401) {
    logout();
    console.log("Unauthorized");
    return true;
  }
  return false;
};

export { handleError };
