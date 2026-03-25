


// export const searchCategories = async (name) => {
//   // backend does not yet provide a search endpoint, so caller can filter locally
//   const data = await getCategories();
//   return data.data ? data.data.filter((c) => c.name?.toLowerCase().includes(name.toLowerCase())) : [];
// };

// export const createCategory = async (category, file) => {
//   const form = new FormData();
//   form.append("data", JSON.stringify(category));
//   if (file) {
//     form.append("image", file);
//   }

//   const response = await axios.post(API_URL, form, {
//     headers: { "Content-Type": "multipart/form-data" , Authorization: `Bearer ${token}` },
//   });
//   return response.data;
// };

// export const deleteCategory = async (id) => {
//   return axios.delete(`${API_URL}/${id}`, { headers: {Authorization:`Bearer ${token}`}});
// };


import axios from "axios";

// Category APIs under /api/categories (context path configured in backend)
const API_URL = "http://localhost:8080/api/categories";

// Token is read inside each function so it is always fresh from localStorage
const getToken = () => localStorage.getItem("token");

export const getCategories = async () => {
  const response = await axios.get(API_URL, {
    params: { page: 0, size: 50 },
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const searchCategories = async (name) => {
  const data = await getCategories();
  return data.data
    ? data.data.filter((c) => c.name?.toLowerCase().includes(name.toLowerCase()))
    : [];
};

export const createCategory = async (category, file) => {
  const form = new FormData();
  form.append("data", JSON.stringify(category));
  if (file) form.append("image", file);

  const response = await axios.post(API_URL, form, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const deleteCategory = async (id) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};