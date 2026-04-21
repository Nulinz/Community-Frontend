import API from "../../utils/api";

export const getCurrentUser = async () => {
  const response = await API.get("/users/me");
  return response.data;
};



export const loginUser = async ({ phone, password }) => {
  const response = await API.post("/users/adminlogin", {
    phone,
    password,
  });
  return response.data;
};

export const logoutUser = async () => {
  const response = await API.post("/users/adminlogout");
  return response.data;
};
