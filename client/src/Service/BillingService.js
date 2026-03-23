import axios from "axios";

const API_URL = "http://localhost:8080/api/billing";
const Whatsapp_Url = "http://localhost:8080/api/whatsapp/send";

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

export const sendWhatsappAlert = async (id) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${Whatsapp_Url}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  console.log("WhatsApp alert response:", response.data);
  return response.data;
};