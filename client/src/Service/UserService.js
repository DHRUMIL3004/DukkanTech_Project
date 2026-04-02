import axios from "axios";

// Backend exposes user APIs at /users (Spring Boot controller uses @RequestMapping("/users"))
const API_URL = "http://localhost:8080/api/users";
const getToken = () => localStorage.getItem("token");

export const getUsers = async (page = 0, size = 50, search = "", role = "ALL", sortBy = "name", sortDir = "ASC") => {
  const response = await axios.get(API_URL, {
    params: { page, size, search, role, sortBy, sortDir },
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
console.log(response.data);
  return response.data;

};

export const searchUsers = async (name) => {
  const response = await axios.get(`${API_URL}/search`, {
    params: { name },
  });
  return response.data;
};

export const createUser = async (user) => {
  const response = await axios.post(API_URL, user, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return response.data;
};

export const updateUser = async (id, user) => {
  const response = await axios.patch(`${API_URL}/${id}`, user, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return response.data;
};

export const deleteUser = async (id) => {

  return axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

};

export const showName = async () => {

  const response = await axios.get(API_URL + "/me", {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  
  console.log(response.data);
  return response.data;
};


