export const handleError = (error) => {
  if (error.response?.data) {
    return error.response.data;
  }

  return {
    success: false,
    message: error.message || "Something went wrong",
  };
};

