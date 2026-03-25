import axios from "axios";

// Item APIs
const API_URL = "http://localhost:8080/api/items";

// GET ITEMS with pagination
export const getItems = async (page = 0, size = 12) => {

  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}?page=${page}&size=${size}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  // Return full paginated response
  // Response format: { page, size, totalPages, totalElements, data: [...] }
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
  form.append("data", new Blob([JSON.stringify(item)], { type: "application/json" }));

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


// UPDATE ITEM
export const updateItem = async (id, item, file) => {

  const token = localStorage.getItem("token");

  const form = new FormData();
  form.append("data", new Blob([JSON.stringify(item)], { type: "application/json" }));

  if (file) {
    form.append("image", file);
  }

  const response = await axios.patch(`${API_URL}/${id}`, form, {
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


// Update Quantity
export const updateItemQuantity = async (id, quantity) => {

  const token = localStorage.getItem("token");

  return axios.patch(
    `${API_URL}/${id}/quantity?quantity=${quantity}`, // query param
    {}, // empty body
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};
