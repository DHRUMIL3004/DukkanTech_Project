import "./Billing.css";
import Loader from "../../Components/Loader";

const Receipt = ({ billResponse, onPrint, onNewOrder, loading }) => {
  return (
    <div className="receipt-wrapper">
      <div className="receipt-card">
        <div className="receipt-header">
          <img src="/Logo.png" alt="DukaanTech Logo" className="logo" />
          <div className="success-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>

          <h2>Order Completed!</h2>
          <p className="order-number">Order #{billResponse.orderId}</p>
        </div>

        <div className="receipt-body">
          <div className="customer-details">
            <div className="detail-row">
              <span className="label">Customer</span>
              <span className="value">{billResponse.customerName}</span>
            </div>
            {billResponse.phone && (
              <div className="detail-row">
                <span className="label">Phone</span>
                <span className="value">{billResponse.phone}</span>
              </div>
            )}
            <div className="detail-row">
              <span className="label">Payment</span>
              <span className="value">{billResponse.paymentMethod}</span>
            </div>
            <div className="detail-row">
              <span className="label">Date</span>
              <span className="value">
                {new Date(billResponse.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="receipt-items-section">
            <h4>Order Items</h4>
            <div className="receipt-table">
              <div className="receipt-row header">
                <span>Item</span>
                <span>Price</span>
                <span>Tax</span>
                <span>Total</span>
              </div>

              {billResponse.items?.map((item, index) => (
                <div key={index} className="receipt-row">
                  <span className="item-name">
                    {item.itemName} &nbsp; x{item.quantity}
                  </span>
                  <span>₹{parseFloat(item.price).toFixed(2)}</span>
                  <span>{item.tax || 0}%</span>
                  <span className="total">
                    ₹{parseFloat(item.total).toFixed(2)}
                  </span>
                </div>
              ))}

              <div className="divider"></div>
            </div>
          </div>

          <div className="receipt-summary">
            <div className="summary-row">
              <span>Sub Total</span>
              <span>₹{parseFloat(billResponse.subTotal).toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax Amount</span>
              <span>₹{parseFloat(billResponse.totalTax).toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{parseFloat(billResponse.totalAmount).toFixed(2)}</span>
            </div>
          </div>

          <div
            className={`payment-badge ${billResponse.paid ? "paid" : "unpaid"}`}
          >
            {billResponse.paid ? "PAID" : "PENDING"}
          </div>
        </div>

        <div className="receipt-actions">
          <button className="btn-outline" onClick={onPrint} disabled={loading}>
            {loading ? "Generating PDF..." : "Print Invoice"}
          </button>
          <button className="btn-primary" onClick={onNewOrder} disabled={loading}>
            New Order
          </button>
        </div>
        {loading && <Loader message="Generating PDF..." overlay />}
      </div>
    </div>
  );
};

export default Receipt;
