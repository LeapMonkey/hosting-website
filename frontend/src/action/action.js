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

export const serviceApi = async (payload) => {
  try {
    const response = await fetch(`${baseURL}/api/services/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response.json();
  } catch (error) {
    return error;
  }
};

export const getServiceApi = async (payload) => {
  try {
    const response = await fetch(`${baseURL}/api/services`, {
      method: "Get",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  } catch (error) {
    return error;
  }
};
