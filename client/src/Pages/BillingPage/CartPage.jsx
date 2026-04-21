import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  cancelRazorpayPayment,
  createBill,
  createRazorpayOrder,
  generatePDF,
  sendWhatsappAlert,
  verifyRazorpayPayment,
} from "../../Service/BillingService";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  CartItemRow,
  OrderSummary,
  Receipt,
  EmptyCart,
} from "../../Modules/Billing";
import "./CartPage.css";
import Footer from "../../Components/Footer/Footer";
import { confirmAction } from "../../Service/DeleteService";
import { getBackendErrorMessage } from "../../Service/errorMessage";

const UPI_MAX_TRANSACTION_INR = 100000;

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
  const [processingPayment, setProcessingPayment] = useState(false);
  const [billResponse, setBillResponse] = useState(null);

  // ============ VALIDATION FUNCTIONS ============

  // Name: Only letters and spaces allowed
  const validateName = (value) => {
    const alphabeticRegex = /^[a-zA-Z\s]+$/;
    if (!value.trim()) return "Customer name is required";
    if (!alphabeticRegex.test(value))
      return "Name should only contain letters and spaces (no numbers or special characters)";
    return "";
  };

  // Phone: Exactly 10 digits
  const validatePhone = (value) => {
    const phoneRegex = /^\d{10}$/;
    if (!value.trim()) return "Phone number is required";
    if (!phoneRegex.test(value))
      return "Phone number must be exactly 10 digits";
    return "";
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
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
  };

  const handleDobChange = (e) => {
    setDob(e.target.value);
  };

  const isFormValid = () => {
    return (
      customerName.trim() &&
      phone.trim() &&
      !validateName(customerName) &&
      !validatePhone(phone)
    );
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
    const item = cartItems.find((ci) => ci.itemId === itemId);
    if (!item) return;

    if (newQuantity > item.availableQuantity) {
      toast.error("Cannot exceed available stock");
      return;
    }

    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(
      cartItems.map((ci) =>
        ci.itemId === itemId ? { ...ci, quantity: newQuantity } : ci,
      ),
    );
  };

  const removeFromCart = async (itemId) => {
    const ok = await confirmAction(
      "Are you sure?",
      "This item will be removed from the cart!",
    );

    if (!ok) {
      return;
    }

    setCartItems(cartItems.filter((ci) => ci.itemId !== itemId));
  };

  // ============ PRICE CALCULATIONS ============

  const calculateItemTaxAmount = (item) =>
    (item.price * item.quantity * item.tax) / 100;
  const subTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalTax = cartItems.reduce(
    (sum, item) => sum + calculateItemTaxAmount(item),
    0,
  );
  const totalAmount = subTotal + totalTax;

  // ============ PAYMENT & INVOICE HANDLERS ============

  const getReceipt = () => {
    const stamp = Date.now();
    const phoneSeed = phone || "guest";
    return `rcpt_${phoneSeed}_${stamp}`;
  };

  const buildBillingRequest = () => ({
    customerName: customerName.trim(),
    phone: phone.trim(),
    city: city.trim(),
    dob: dob.trim(),
    paymentMethod,
    items: cartItems.map((item) => ({
      itemId: item.itemId,
      quantity: item.quantity,
      tax: item.tax,
    })),
  });

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
          contact: phone,
        },
        method: {
          upi: true,
          card: false,
          netbanking: false,
          wallet: false,
          emi: false,
          paylater: false,
        },
      theme: {
        color: "#0b7a5a",
        },
      handler: async (response) => {
        try {
          const verifyResponse = await verifyRazorpayPayment({
            receipt: orderPayload.receipt,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
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
              reason: "Checkout closed by user",
            });
          } catch (cancelError) {
            console.error("Cancel payment error:", cancelError);
          }
          reject(new Error("Payment cancelled by user"));
        },
        },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.on("payment.failed", async () => {
      try {
        await cancelRazorpayPayment({
          receipt: orderPayload.receipt,
          razorpayOrderId: orderPayload.razorpayOrderId,
          reason: "Payment failed at gateway",
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
  const ok = await confirmAction(
    "Confirm Payment",
    `Total amount to be paid: INR ${totalAmount.toFixed(2)}. Do you want to proceed?`,
  );

  if (!ok) {
    return;
  }

  if (cartItems.length === 0) {
    toast.error("Please add items to the cart");
    return;
  }

  if (!isFormValid()) {
    toast.error("Please fill valid customer details before payment");
    return;
  }

  try {
    setProcessingPayment(true);

    if (paymentMethod === "UPI") {
      if (totalAmount > UPI_MAX_TRANSACTION_INR) {
        throw new Error(
          `UPI payment limit exceeded for a single transaction. Please keep total at or below INR ${UPI_MAX_TRANSACTION_INR}.`,
        );
      }

      const receipt = getReceipt();
      const orderPayload = await createRazorpayOrder({
        amount: totalAmount,
        currency: "INR",
        receipt,
        customerName: customerName.trim(),
        phone: phone.trim(),
      });

      if (orderPayload.status === "PAID") {
        toast.info("Payment already completed for this receipt. Continuing.");
      } else {
        const verifyResult = await openRazorpayCheckout(orderPayload);
        if (!verifyResult?.verified) {
          throw new Error("Payment verification failed");
        }
      }
    } else {
      toast.info("Cash payment selected.");
    }

    const orderResponse = await createBill(buildBillingRequest());
    const savedOrder = orderResponse?.data || orderResponse;
    localStorage.setItem("BillResponse", JSON.stringify(savedOrder));
    console.log("Saved order response:", savedOrder);

    setBillResponse(savedOrder);
    setCartItems([]);
    localStorage.removeItem("billingCart");

    if (savedOrder?.orderId) {
      sendWhatsappAlert(savedOrder.orderId);
    }

    toast.success("Payment successfully processed.");
  } catch (error) {
    console.error(error);
    toast.error(
      getBackendErrorMessage(error, "Payment failed. Order was not saved."),
    );
  } finally {
    setProcessingPayment(false);
  }
};

// Reset form and start new order
const handleNewOrder = () => {
  setBillResponse(null);
  setCustomerName("");
  setPhone("");

  setPaymentMethod("CASH");
  navigate("/billing");
  localStorage.removeItem("BillResponse");
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
          onPrint={generatePDF}
          onNewOrder={handleNewOrder}
        />
      </div>
    </>
  );
}

// Main cart view
return (
  <>
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
                {cartItems.map((item) => (
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
              isFormValid={isFormValid()}
              processingPayment={processingPayment}
            />
          )}
        </div>
      </div>
    </div>
    <Footer />
  </>
);
};

export default CartPage;
