
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  cancelRazorpayPayment,
  createBill,
  createRazorpayOrder,
  sendWhatsappAlert,
  verifyRazorpayPayment
} from "../../Service/BillingService";
import { updateItemQuantity } from "../../Service/ItemService";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  CartItemRow,
  OrderSummary,
  Receipt,
  Popup,
  EmptyCart
} from "../../Components/Billing";
import "./CartPage.css";

const CartPage = () => {
  
  const navigate = useNavigate();
  
  // ============ STATE MANAGEMENT ============

  // Cart items (synced with localStorage)
  const [cartItems, setCartItems] = useState([]);
  
  // Customer form fields
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [dob, setDob] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  
  // Form validation errors
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  
  // UI state
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [billResponse, setBillResponse] = useState(null);

  // ============ VALIDATION FUNCTIONS ============

  // Name: Only letters and spaces allowed
  const validateName = (value) => {
    const alphabeticRegex = /^[a-zA-Z\s]+$/;
    if (!value.trim()) return "Customer name is required";
    if (!alphabeticRegex.test(value)) return "Name should only contain letters and spaces (no numbers or special characters)";
    return "";
  };

  // Phone: Exactly 10 digits
  const validatePhone = (value) => {
    const phoneRegex = /^\d{10}$/;
    if (!value.trim()) return "Phone number is required";
    if (!phoneRegex.test(value)) return "Phone number must be exactly 10 digits";
    return "";
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    setPhone(value);
    setPhoneError(validatePhone(value));
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setCustomerName(value);
    setNameError(validateName(value));
  };

const handleCityChange = (e) => {
   const value = e.target.value;
    setCity(value);
                                                         
}

const handleDobChange = (e) => {
  setDob(e.target.value);
}                                       

  const isFormValid = () => {
    return customerName.trim() && 
           phone.trim() && 
           !validateName(customerName) && 
           !validatePhone(phone);
  };

  // ============ EFFECTS ============

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("billingCart");
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);

  // Persist cart to localStorage on change
  useEffect(() => {
    localStorage.setItem("billingCart", JSON.stringify(cartItems));
  }, [cartItems]);

  // ============ CART OPERATIONS ============

  // Update item quantity with stock validation
  const updateQuantity = (itemId, newQuantity) => {
    const item = cartItems.find(ci => ci.itemId === itemId);
    if (!item) return;

    if (newQuantity > item.availableQuantity) {
      toast.error("Cannot exceed available stock");
      return;
    }

    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(cartItems.map(ci =>
      ci.itemId === itemId ? { ...ci, quantity: newQuantity } : ci
    ));
  };

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(ci => ci.itemId !== itemId));
  };

  // ============ PRICE CALCULATIONS ============

  const calculateItemTaxAmount = (item) => (item.price * item.quantity * item.tax) / 100;
  const subTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalTax = cartItems.reduce((sum, item) => sum + calculateItemTaxAmount(item), 0);
  const totalAmount = subTotal + totalTax;

  // ============ PAYMENT & INVOICE HANDLERS ============

  const getReceipt = () => {
    const stamp = Date.now();
    const phoneSeed = phone || "guest";
    return `rcpt_${phoneSeed}_${stamp}`;
  };

  const updateStockAfterPayment = async () => {
    try {
      await Promise.all(
        cartItems.map(async (item) => {
          const newQuantity = item.availableQuantity - item.quantity;
          if (newQuantity < 0) throw new Error(`Not enough stock for ${item.itemName}`);
          await updateItemQuantity(item.itemId, newQuantity);
        })
      );
    } catch (error) {
      throw new Error(error.message || "Stock update failed");
    }
  };

  const openRazorpayCheckout = async (orderPayload) => {
    if (!window.Razorpay) {
      throw new Error("Razorpay SDK not loaded. Please refresh the page.");
    }

    return new Promise((resolve, reject) => {
      const options = {
        key: orderPayload.keyId,
        amount: orderPayload.amountInPaise,
        currency: orderPayload.currency,
        name: "DukaanTech",
        description: "UPI Payment",
        order_id: orderPayload.razorpayOrderId,
        prefill: {
          name: customerName,
          contact: phone
        },
        method: {
          upi: true,
          card: false,
          netbanking: false,
          wallet: false,
          emi: false,
          paylater: false
        },
        theme: {
          color: "#0b7a5a"
        },
        handler: async (response) => {
          try {
            const verifyResponse = await verifyRazorpayPayment({
              receipt: orderPayload.receipt,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });
            resolve(verifyResponse);
          } catch (error) {
            reject(error);
          }
        },
        modal: {
          ondismiss: async () => {
            try {
              await cancelRazorpayPayment({
                receipt: orderPayload.receipt,
                razorpayOrderId: orderPayload.razorpayOrderId,
                reason: "Checkout closed by user"
              });
            } catch (cancelError) {
              console.error("Cancel payment error:", cancelError);
            }
            reject(new Error("Payment cancelled by user"));
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", async () => {
        try {
          await cancelRazorpayPayment({
            receipt: orderPayload.receipt,
            razorpayOrderId: orderPayload.razorpayOrderId,
            reason: "Payment failed at gateway"
          });
        } catch (cancelError) {
          console.error("Cancel on failure error:", cancelError);
        }
        reject(new Error("UPI payment failed"));
      });
      razorpay.open();
    });
  };

  // Process payment and update stock in backend
  const handleCompleted = async () => {
    if (cartItems.length === 0) {
      toast.error("Please add items to the cart");
      return;
    }

    if (!isFormValid()) {
      toast.error("Please fill valid customer details before payment");
      return;
    }

    if (submitting) {
      toast.info("Payment already completed. You can generate invoice now.");
      return;
    }

    try {
      setProcessingPayment(true);

      if (paymentMethod === "UPI") {
        const receipt = getReceipt();
        const orderPayload = await createRazorpayOrder({
          amount: totalAmount,
          currency: "INR",
          receipt,
          customerName: customerName.trim(),
          phone: phone.trim()
        });

        if (orderPayload.status === "PAID") {
          toast.info("Payment already completed for this receipt. Continuing.");
        } else {
          const verifyResult = await openRazorpayCheckout(orderPayload);
          if (!verifyResult?.verified) {
            throw new Error("Payment verification failed");
          }
        }

      }

      await updateStockAfterPayment();
      setSubmitting(true);
      setShowPaymentPopup(true);
      toast.success("Payment successful. Generate invoice now.");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Payment failed");
      setSubmitting(false);
    } finally {
      setProcessingPayment(false);
    }
  };

  const handlePaymentPopupOk = () => {
    setShowPaymentPopup(false);
  };

  // Create bill via API and show receipt
  const handleGenerateInvoice = async () => {
    if (cartItems.length === 0) {
      toast.error("Please add items to the cart");
      return;
    }

    if (!customerName.trim()) {
      toast.error("Please enter customer name");
      return;
    }

    const billingRequest = {
      customerName: customerName.trim(),
      phone: phone.trim(),
      city: city.trim(),
      dob: dob.trim(),
      paymentMethod: paymentMethod,
      items: cartItems.map(item => ({
        itemId: item.itemId,
        quantity: item.quantity,
        tax: item.tax
      }))
    };
let finalResponse = null;
    try {
      const response = await createBill(billingRequest);
      finalResponse = response.data || response; // Handle both axios and fetch responses
      setBillResponse(finalResponse);
      setCartItems([]);
      localStorage.removeItem("billingCart");
    } catch (error) {
      console.error("Error creating bill:", error);
      toast.error("Invoice generation failed");
      return;
    } finally {
      setSubmitting(false);
      
      if (finalResponse?.orderId) {
        sendWhatsappAlert(finalResponse.orderId);
      }
    }
  };

  // Reset form and start new order
  const handleNewOrder = () => {
    setBillResponse(null);
    setCustomerName("");
    setPhone("");
    
    setPaymentMethod("CASH");
    navigate("/billing");
  };

  const goBack = () => navigate("/billing");

  // ============ RENDER ============

  // Show receipt after successful order
  if (billResponse) {
    return (
      <>
        
        <div className="cart-page">
          <Receipt
            billResponse={billResponse}
            onPrint={() => window.print()}
            onNewOrder={handleNewOrder}
          />
        </div>
      </>
    );
  }

  // Main cart view
  return (
    <>
   

      {/* Payment Success Popup */}
      {showPaymentPopup && (
        <Popup
          type="success"
          title="Payment Received Successfully"
          message="The payment has been processed successfully."
          onClose={handlePaymentPopupOk}
        />
      )}

      <div className="cart-page">
        <div className="cart-wrapper">
          
          {/* Back Navigation */}
          <button className="back-btn" onClick={goBack}>
            <FaArrowLeft />
            <span>Back to Products</span>
          </button>

          <div className="cart-layout">
            
            {/* Left: Cart Items List */}
            <div className="cart-items-section">
              <div className="section-header">
                <h2>Shopping Cart</h2>
                <span className="item-count">{cartItems.length} items</span>
              </div>

              {cartItems.length === 0 ? (
                <EmptyCart onBrowseProducts={goBack} />
              ) : (
                <div className="cart-items-list">
                  {/* Table Header */}
                  <div className="cart-table-header">
                    <span className="col-product">Product</span>
                    <span className="col-price">Price</span>
                    <span className="col-qty">Quantity</span>
                    <span className="col-total">Total</span>
                    <span className="col-action">Delete</span>
                  </div>

                  {/* Cart Item Rows */}
                  {cartItems.map(item => (
                    <CartItemRow
                      key={item.itemId}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right: Order Summary with customer form and payment */}
            {cartItems.length > 0 && (
              <OrderSummary
                customerName={customerName}
                phone={phone}
                city={city}
                dob={dob}
                nameError={nameError}
                phoneError={phoneError}
                onNameChange={handleNameChange}
                onPhoneChange={handlePhoneChange}
                onCityChange={handleCityChange}
                onDobChange={handleDobChange}
                subTotal={subTotal}
                totalTax={totalTax}
                totalAmount={totalAmount}
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
                onCompletePayment={handleCompleted}
                onGenerateInvoice={handleGenerateInvoice}
                isFormValid={isFormValid()}
                submitting={submitting}
                processingPayment={processingPayment}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
