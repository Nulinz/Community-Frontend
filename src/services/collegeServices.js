import API from "../utils/api";
export const apiGetCollegeDashboard = async () => {
  try {
    const res = await API.get("/college/dashboard");
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

export const getMyCollege= async () => {
  try {
    const res = await API.get(`/college/getMyCollege`);
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
