import axios from "axios";

// Backend exposes user APIs at /users (Spring Boot controller uses @RequestMapping("/users"))
const API_URL = "http://localhost:8080/api/users";

export const getUsers = async () => {

  const token = localStorage.getItem("token");

  const response = await axios.get(API_URL, {
    params: { page: 0, size: 50 },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

export const searchUsers = async (name) => {
  const response = await axios.get(`${API_URL}/search`, {
    params: { name },
  });
  return response.data;
};

export const createUser = async (user) => {

  const token = localStorage.getItem("token");

  const response = await axios.post(API_URL, user, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

export const deleteUser = async (id) => {

  const token = localStorage.getItem("token");

  return axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

};