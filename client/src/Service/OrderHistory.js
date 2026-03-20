const API_URL = "http://localhost:8080/api/billing";

export const getOrders = async (
  page = 0,
  size = 10,
  search = "",
  fromDate = "",
  toDate = "",
  sortBy = "createdAt",
  sortDir = "desc"
) => {
  let url = `${API_URL}/orders?page=${page}&size=${size}`;

  if (search) url += `&search=${search}`;
  if (fromDate) url += `&fromDate=${fromDate}`;
  if (toDate) url += `&toDate=${toDate}`;
  if (sortBy) url += `&sortBy=${sortBy}`;
  if (sortDir) url += `&sortDir=${sortDir}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) throw new Error("Failed");

  return await response.json();
};