import axios from "axios";

const API_URL = "http://localhost:8080/api/billing";

// CREATE BILL
export const createBill = async (billingRequest) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(`${API_URL}/create`, billingRequest, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  return response.data;
};

// GET ALL BILLS (if needed later)
export const getBills = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};