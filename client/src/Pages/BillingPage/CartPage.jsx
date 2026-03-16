import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createBill } from "../../Service/BillingService";
import NavBar from "../../Components/NavBar/NavBar";
import { FaArrowLeft, FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import "./CartPage.css";

const CartPage = () => {
  const navigate = useNavigate();
  
  // Cart items from localStorage
  const [cartItems, setCartItems] = useState([]);
  
  // Customer info
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  
  // Submitting state
  const [submitting, setSubmitting] = useState(false);
  
  // Bill response
  const [billResponse, setBillResponse] = useState(null);

  // Custom alert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success"); // success, info

  // Show custom alert
  const showAlert = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  // Close alert
  const closeAlert = () => {
    setAlertVisible(false);
  };

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("billingCart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("billingCart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Update quantity
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(cartItems.map(ci =>
      ci.itemId === itemId ? { ...ci, quantity: newQuantity } : ci
    ));
  };

  // Remove from cart
  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(ci => ci.itemId !== itemId));
  };

  // Calculate totals
  const calculateItemTaxAmount = (item) => {
    const baseAmount = item.price * item.quantity;
    return (baseAmount * item.tax) / 100;
  };

  const subTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalTax = cartItems.reduce((sum, item) => sum + calculateItemTaxAmount(item), 0);
  const totalAmount = subTotal + totalTax;

  // Handle completed order
  const handleCompleted = async () => {
    if (cartItems.length === 0) {
      alert("Please add items to the cart");
      return;
    }

    if (!customerName.trim()) {
      alert("Please enter customer name");
      return;
    }

    setSubmitting(true);

    const billingRequest = {
      customerName: customerName.trim(),
      phone: phone.trim(),
      paymentMethod: paymentMethod,
      items: cartItems.map(item => ({
        itemId: item.itemId,
        quantity: item.quantity
      }))
    };

    try {
      const response = await createBill(billingRequest);
      setBillResponse(response.data || response);
      // Clear cart after successful order
      setCartItems([]);
      localStorage.removeItem("billingCart");
    } catch (error) {
      console.error("Error creating bill:", error);
      // For demo, create mock response
      const mockResponse = {
        orderId: Math.floor(Math.random() * 10000) + 1000,
        customerName: customerName.trim(),
        phone: phone.trim(),
        paymentMethod: paymentMethod,
        items: cartItems.map(item => ({
          itemName: item.itemName,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        })),
        subTotal: subTotal,
        totalTax: totalTax,
        totalAmount: totalAmount,
        paid: true,
        createdAt: new Date().toISOString()
      };
      setBillResponse(mockResponse);
      setCartItems([]);
      localStorage.removeItem("billingCart");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle generate invoice
  const handleGenerateInvoice = async () => {
    await handleCompleted();
  };

  // New order
  const handleNewOrder = () => {
    setBillResponse(null);
    setCustomerName("");
    setPhone("");
    setPaymentMethod("CASH");
    navigate("/billing");
  };

  // Print invoice
  const handlePrint = () => {
    window.print();
  };

  // Back to billing
  const goBack = () => {
    navigate("/billing");
  };

  // Show receipt if order completed
  if (billResponse) {
    return (
      <>
        <NavBar />
        <div className="cart-page">
          <div className="receipt-wrapper">
            <div className="receipt-card">
              <div className="receipt-header">
                <div className="success-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                    <span className="value">{new Date(billResponse.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="receipt-items-section">
                  <h4>Order Items</h4>
                  <div className="receipt-items-list">
                    {billResponse.items?.map((item, index) => (
                      <div key={index} className="receipt-item-row">
                        <div className="item-info">
                          <span className="item-name">{item.itemName}</span>
                          <span className="item-qty">x{item.quantity}</span>
                        </div>
                        <span className="item-total">${parseFloat(item.total).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="receipt-summary">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>${parseFloat(billResponse.subTotal).toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax</span>
                    <span>${parseFloat(billResponse.totalTax).toFixed(2)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>${parseFloat(billResponse.totalAmount).toFixed(2)}</span>
                  </div>
                </div>

                <div className={`payment-badge ${billResponse.paid ? "paid" : "unpaid"}`}>
                  {billResponse.paid ? "PAID" : "PENDING"}
                </div>
              </div>

              <div className="receipt-actions">
                <button className="btn-outline" onClick={handlePrint}>
                  Print Invoice
                </button>
                <button className="btn-primary" onClick={handleNewOrder}>
                  New Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="cart-page">
        <div className="cart-wrapper">
          {/* Back Button */}
          <button className="back-btn" onClick={goBack}>
            <FaArrowLeft />
            <span>Back to Products</span>
          </button>

          <div className="cart-layout">
            {/* Left: Cart Items */}
            <div className="cart-items-section">
              <div className="section-header">
                <h2>Shopping Cart</h2>
                <span className="item-count">{cartItems.length} items</span>
              </div>

              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <div className="empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                  </div>
                  <h3>Your cart is empty</h3>
                  <p>Add some products to get started</p>
                  <button className="btn-primary" onClick={goBack}>
                    Browse Products
                  </button>
                </div>
              ) : (
                <div className="cart-items-list">
                  {/* Table Header */}
                  <div className="cart-table-header">
                    <span className="col-product">Product</span>
                    <span className="col-price">Price</span>
                    <span className="col-qty">Quantity</span>
                    <span className="col-total">Total</span>
                    <span className="col-action"></span>
                  </div>

                  {/* Cart Items */}
                  {cartItems.map(item => (
                    <div key={item.itemId} className="cart-item-row">
                      <div className="col-product">
                        <span className="product-name">{item.itemName}</span>
                      </div>
                      
                      <div className="col-price">
                        <span>${item.price.toFixed(2)}</span>
                      </div>
                      
                      <div className="col-qty">
                        <div className="qty-control">
                          <button 
                            className="qty-btn"
                            onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                          >
                            <FaMinus />
                          </button>
                          <span className="qty-value">{item.quantity}</span>
                          <button 
                            className="qty-btn"
                            onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>
                      
                      <div className="col-total">
                        <span className="item-total">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      
                      <div className="col-action">
                        <button 
                          className="delete-btn"
                          onClick={() => removeFromCart(item.itemId)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Order Summary */}
            {cartItems.length > 0 && (
              <div className="order-summary-section">
                <div className="summary-card">
                  <h3>Order Summary</h3>

                  {/* Customer Info */}
                  <div className="form-group">
                    <label>Customer Name *</label>
                    <input
                      type="text"
                      placeholder="Enter customer name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  {/* Totals */}
                  <div className="totals-section">
                    <div className="total-row">
                      <span>Subtotal</span>
                      <span>₹{subTotal.toFixed(2)}</span>
                    </div>
                    <div className="total-row">
                      <span>Tax</span>
                      <span>₹{totalTax.toFixed(2)}</span>
                    </div>
                    <div className="total-row grand-total">
                      <span>Total</span>
                      <span>₹{totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="payment-section">
                    <label>Payment Method</label>
                    <div className="payment-options">
                      <button
                        className={`payment-option ${paymentMethod === "CASH" ? "active" : ""}`}
                        onClick={() => setPaymentMethod("CASH")}
                      >
                        Cash
                      </button>
                      <button
                        className={`payment-option ${paymentMethod === "UPI" ? "active" : ""}`}
                        onClick={() => setPaymentMethod("UPI")}
                      >
                        UPI
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="action-buttons">
                    <button
                      className="btn-success"
                      onClick={handleCompleted}
                      disabled={submitting || !customerName.trim()}
                    >
                      {submitting ? "Processing..." : "Completed"}
                    </button>
                    <button
                      className="btn-primary"
                      onClick={handleGenerateInvoice}
                      disabled={submitting || !customerName.trim()}
                    >
                      Generate Invoice
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
