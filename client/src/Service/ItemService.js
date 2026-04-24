import axios from "axios";
import { buildUrl } from "./baseUrl";

// Item APIs
const API_URL = buildUrl("/api/items");

// GET ITEMS with pagination, search, filtering, and sorting
export const getItems = async (
  page = 0,
  size = 12,
  search = "",
  category = "ALL",
  sortBy = "name",
  sortDir = "ASC",
) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(API_URL, {
    params: { page, size, search, category, sortBy, sortDir },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Return full paginated response
  // Response format: { page, size, totalPages, totalElements, data: [...] }
  return response.data;
};

// SEARCH ITEMS (backend filter)
export const searchItems = async (name) => {
  const data = await getItems(0, 1000, name);
  return data.data ?? [];
};

// CREATE ITEM
export const createItem = async (item, file) => {
  const token = localStorage.getItem("token");

  const form = new FormData();
  form.append(
    "data",
    new Blob([JSON.stringify(item)], { type: "application/json" }),
  );

  if (file) {
    form.append("image", file);
  }

  const response = await axios.post(API_URL, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// UPDATE ITEM
export const updateItem = async (id, item, file) => {
  const token = localStorage.getItem("token");

  const form = new FormData();
  form.append(
    "data",
    new Blob([JSON.stringify(item)], { type: "application/json" }),
  );

  if (file) {
    form.append("image", file);
  }

  const response = await axios.patch(`${API_URL}/${id}`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// DELETE ITEM
export const deleteItem = async (id) => {
  const token = localStorage.getItem("token");

  return axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
        Authorization: `Bearer ${token}`,
      },
    },
  );
};
