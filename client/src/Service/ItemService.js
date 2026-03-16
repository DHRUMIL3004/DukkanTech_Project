import axios from "axios";

// Item APIs
const API_URL = "http://localhost:8080/api/items";

// GET ITEMS
// export const getItems = async () => {

//   const response = await axios.get(API_URL, {
//     params: { page: 0, size: 50 },
//     headers: { Authorization: `Bearer ${token}` }
//   });

//   return response.data;

// };

// TEMP: unauthenticated item APIs for development
export const getItems = async () => {

  const token = localStorage.getItem("token");

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};


// SEARCH ITEMS (local filter)
export const searchItems = async (name) => {

  const data = await getItems();

  return data.data
    ? data.data.filter((i) =>
        i.name?.toLowerCase().includes(name.toLowerCase())
      )
    : [];

};


// CREATE ITEM
export const createItem = async (item, file) => {

  const token = localStorage.getItem("token");

  const form = new FormData();
  form.append("data", JSON.stringify(item));

  if (file) {
    form.append("image", file);
  }

  const response = await axios.post(API_URL, form, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};


// DELETE ITEM
export const deleteItem = async (id) => {

  const token = localStorage.getItem("token");

  return axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};