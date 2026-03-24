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
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Missing auth token. Please login again.");
  }

  let url = `${API_URL}/orders?page=${page}&size=${size}`;

  if (search) url += `&search=${search}`;
  if (fromDate) url += `&fromDate=${fromDate}`;
  if (toDate) url += `&toDate=${toDate}`;
  if (sortBy) url += `&sortBy=${sortBy}`;
  if (sortDir) url += `&sortDir=${sortDir}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let details = "Request failed";
    try {
      details = await response.text();
    } catch {
      // keep default
    }
    if (response.status === 401 || response.status === 403) {
      throw new Error("Session expired or access denied. Please login again.");
    }
    throw new Error(`Failed (${response.status}): ${details}`);
  }

  return await response.json();
};