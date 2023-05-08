import axios from "axios";
const baseURL = "http://localhost:8000";

export const loginApi = async (payload) => {
  try {
    const response = await axios.post(`${baseURL}/login`, payload);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
    throw new Error(response.data);
  } catch (error) {
    return error;
  }
};
