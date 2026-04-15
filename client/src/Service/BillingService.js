import axios from "axios";
import { Phone } from "lucide-react";
import { toast } from "react-toastify";

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


//generate bill pdf
export const generatePDF = async () => {
  const token = localStorage.getItem("token");
  const billResponse = JSON.parse(localStorage.getItem("BillResponse"));

  const data = {
    orderId: billResponse.orderId,
    customerName: billResponse.customerName,
    phone: billResponse.phone,
    paymentMethod: billResponse.paymentMethod,
    date: new Date(billResponse.createdAt).toLocaleString(),
    items: billResponse.items.map(item => ({
      name: item.itemName,
      price: item.price,
      quantity: item.quantity,
      tax: item.taxAmount,
      total: item.total
    })),
    subTotal: billResponse.subTotal,
   totalTax: billResponse.totalTax,
  totalAmount: billResponse.totalAmount
  };

  const res = await axios.post(`${API_URL}/invoice`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    responseType: "blob"
  });

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const a = document.createElement("a");
  a.href = url;
  a.download = "invoice.pdf";
  a.click();

  toast.success("Invoice PDF generated successfully.");
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
