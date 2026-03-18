const API_URL = "http://localhost:8080/api/billing";

export const getOrders = async (page = 0, size = 10) => {
  try {
    const response = await fetch(
      `${API_URL}/orders?page=${page}&size=${size}`
    ,{headers:{Authorization: `Bearer ${localStorage.getItem("token")}`}});

    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }

    return await response.json();
  } catch (error) {
    console.error("Order API Error:", error);
    throw error;
  }
};