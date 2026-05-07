import API from "../../utils/api";

export const getCurrentUser = async () => {
  try {
    const res = await API.get("/users/me");
    return res.data;
  } catch (error) {
    throw (
      error.response?.data || {
        status: false,
        message: error.message,
      }
    );
  }
};



export const loginUser = async ({ phone, password }) => {
  try {
    const res = await API.post("/users/login", {
      phone,
      password,
    });
    return res.data;
  } catch (error) {
    throw (
      error.response?.data || {
        status: false,
        message: error.message,
      }
    );
  }
};


export const changePassword = async ({
  currentPassword,
  newPassword,
  confirmPassword,
}) => {
  try {
    const res = await API.post("/users/change-password", {
      currentPassword,
      newPassword,
      confirmPassword,
    });

    return res.data;
  } catch (error) {
    throw (
      error.response?.data || {
        status: false,
        message: error.message,
      }
    );
  }
};
export const logoutUser = async () => {
  try {
    const res = await API.get("/users/logout");
    return res.data;
  } catch (error) {
    throw (
      error.response?.data || {
        status: false,
        message: error.message,
      }
    );
  }
};
