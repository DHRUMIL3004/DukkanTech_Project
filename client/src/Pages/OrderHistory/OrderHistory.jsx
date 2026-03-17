import { useEffect, useState } from "react";
import NavBar from "../../Components/NavBar/NavBar";
import { getOrders } from "../../Service/OrderHistory";
import { IoEyeOutline } from "react-icons/io5";
import "./OrderHistory.css";

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

                <div className="table-card">
                    <div className="table-header">
                        <span>No</span>
                        <span>Name</span>
                        <span>Items</span>
                        <span>Total</span>
                        <span>Payment</span>
                        <span>Status</span>
                        <span>Date</span>
                    </div>

                    {orders.map((order, index) => (
                        <div className="table-row" key={order.orderId}>
                            <span>{index + 1 + page * 5}</span>
                            <span>{order.customerName}</span>
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

                <div className="pagination">
                    <button
                        disabled={page === 0}
                        onClick={() => setPage(page - 1)}
                    >
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