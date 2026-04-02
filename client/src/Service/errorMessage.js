export const getBackendErrorMessage = (error, fallback = "Something went wrong") => {
  if (!error) return fallback;

  const data = error.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (typeof data === "object" && data !== null) {
    if (typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }

    if (data.errors && typeof data.errors === "object") {
      const firstError = Object.values(data.errors).find(
        (value) => typeof value === "string" && value.trim(),
      );
      if (firstError) return firstError;
    }
  }

  if (typeof error.message === "string" && error.message.trim()) {
    return error.message;
  }

  return fallback;
};
