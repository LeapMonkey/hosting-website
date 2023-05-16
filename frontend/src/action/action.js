const baseURL = "http://localhost:8000";

export const loginApi = async (payload) => {
  try {
    const response = await fetch(`${baseURL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response.json();
  } catch (error) {
    return error;
  }
};

export const registerApi = async (payload) => {
  try {
    const response = await fetch(`${baseURL}/api/users/adduser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response.json();
  } catch (error) {
    return error;
  }
};
