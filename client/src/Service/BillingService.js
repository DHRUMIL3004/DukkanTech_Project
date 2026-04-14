import axios from "axios";

const API_URL = "http://localhost:8080/api/billing";
const Whatsapp_Url = "http://localhost:8080/api/whatsapp/send";
const PAYMENT_URL = "http://localhost:8080/api/payment/razorpay";

// CREATE BILL
export const createBill = async (billingRequest) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(`${API_URL}/create`, billingRequest, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

// GET ALL BILLS (if needed later)
export const getBills = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

//whatsapp notification

export const sendWhatsappAlert = async (id) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${Whatsapp_Url}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("WhatsApp alert response:", response.data);
  return response.data;
};

// total revenue
export const getTotalRevenue = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/revenue`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response.data);
  return response.data;
};

// RAZORPAY CREATE ORDER
export const createRazorpayOrder = async (payload) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(`${PAYMENT_URL}/order`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

// RAZORPAY VERIFY PAYMENT
export const verifyRazorpayPayment = async (payload) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(`${PAYMENT_URL}/verify`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

// RAZORPAY CANCEL PAYMENT
export const cancelRazorpayPayment = async (payload) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(`${PAYMENT_URL}/cancel`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
