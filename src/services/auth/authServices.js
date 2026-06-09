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
    const res = await API.post("/users/web-login", {
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


// 🔹 RESEND OTP
export const resendOtp = async ({ phone, type }) => {
  try {
    const res = await API.post("/users/resend-otp", {
      phone,
      type,
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

// 🔹 FORGOT PASSWORD (Generate OTP)
export const forgotPassword = async ({ phone }) => {
  try {
    const res = await API.post("/users/forgot-password", {
      phone,
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

// 🔹 VERIFY FORGOT OTP
export const forgotOtpVerify = async ({ phone, otp }) => {
  try {
    const res = await API.post("/users/forgot-otp-verify", {
      phone,
      otp,
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

// 🔹 RESET PASSWORD
export const resetPassword = async ({ phone, new_password }) => {
  try {
    const res = await API.post("/users/reset-password", {
      phone,
      new_password,
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
