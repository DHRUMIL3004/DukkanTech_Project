import { useEffect, useState } from "react";
import NavBar from "../../Components/NavBar/NavBar";
import { getOrders } from "../../Service/OrderHistory";
import "./OrderHistory.css";

// ✅ Group function
const groupByCustomer = (orders) => {
  return orders.reduce((acc, order) => {
    if (!acc[order.phone]) {
      acc[order.phone] = {
        customerName: order.customerName,
        phone: order.phone,
        orders: []
      };
    }
    acc[order.phone].orders.push(order);
    return acc;
  }, {});
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchOrders = async () => {
    try {
      const data = await getOrders(page, 10);

      setOrders(data.data);
      setTotalPages(data.totalPages);
      setPage(data.page);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  // ✅ IMPORTANT: compute here
  const groupedOrders = groupByCustomer(orders);

  const formatItems = (items) => {
    return items.map((item) => item.itemName).join(", ");
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB");
  };

  return (
    <>
      <NavBar />

      <div className="order-container">
        <h2 className="title">Order History</h2>

        {/* ✅ Grouped UI */}
        {Object.values(groupedOrders).map((customer, index) => (
          <div className="customer-card" key={index}>

            {/* Customer Header */}
            <div className="customer-header">
              <h5>{customer.customerName}</h5>
              <span>📞 {customer.phone}</span>
            </div>

            {/* Orders List */}
            <div className="table-header">
              <span>No</span>
              <span>Items</span>
              <span>Total</span>
              <span>Payment</span>
              <span>Status</span>
              <span>Date</span>
            </div>

            {customer.orders.map((order, i) => (
              <div className="table-row" key={order.orderId}>
                <span>{i + 1}</span>
                <span>{formatItems(order.items)}</span>
                <span>₹ {order.totalAmount}</span>
                <span>{order.paymentMethod}</span>

                <span className={order.paid ? "status success" : "status fail"}>
                  {order.paid ? "Success" : "Failed"}
                </span>

                <span>{formatDate(order.createdAt)}</span>
              </div>
            ))}

          </div>
        ))}

        {/* Pagination */}
        <div className="pagination">
          <button disabled={page === 0} onClick={() => setPage(page - 1)}>
            Prev
          </button>

          <span>
            Page {page + 1} of {totalPages}
          </span>

          <button
            disabled={page === totalPages - 1}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default OrderHistory;