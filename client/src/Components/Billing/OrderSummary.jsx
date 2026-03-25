import { useState } from "react";
import FormInput from "./FormInput";
import "./Billing.css";

const OrderSummary = ({
  customerName,
  phone,
  city,
  dob,
  nameError,
  phoneError,

  onNameChange,
  onPhoneChange,
  onCityChange,
  onDobChange,
  subTotal,
  totalTax,
  totalAmount,
  paymentMethod,
  onPaymentMethodChange,
  onCompletePayment,
  onGenerateInvoice,
  isFormValid,
  submitting,
  processingPayment
}) => {
  const [customerFound, setCustomerFound] = useState(false);
  const [loadingCustomer, setLoadingCustomer] = useState(false);

  // 🔍 Handle phone change + fetch customer
  const handlePhoneInput = async (e) => {
    const value = e.target.value;

    onPhoneChange(e);

    const token = localStorage.getItem("token");

    if (value.length === 10) {
      setLoadingCustomer(true);

      try {
       const res = await fetch(`http://localhost:8080/api/customer/${value}`, {
       headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
        
        if (res.ok) {
          const data = await res.json();
          console.log("Customer data:", data);

       
        

          // Auto fill
          onNameChange({ target: { value: data.customerName } });
          onCityChange({ target: { value: data.city || "" } });
          onDobChange({ target: { value: data.dob || "" } });
          
            setCustomerFound(true);

        } else {
          //  Not found
          setCustomerFound(false);
          
          onCityChange({ target: { value: "" } });
          onDobChange({ target: { value: "" } });
        }

      } catch (err) {
        console.error(err);
        setCustomerFound(false);
      } finally {
        setLoadingCustomer(false);
        
      }
    }

   
  };

  return (
    <div className="order-summary-section">
      <div className="summary-card">
        <h3>Order Summary</h3>

        {/* Phone (Always Enabled) */}
        <FormInput
          label="Phone Number"
          type="tel"
          placeholder="Enter 10-digit phone number"
          value={phone}
          onChange={handlePhoneInput}
          error={phoneError}
          maxLength={10}
          required
        />

        {loadingCustomer && <p>Checking customer...</p>}

        {/* Customer Not Found Message */}
        
{phone.length === 10 && !loadingCustomer && (
  !customerFound ? (
    <p style={{ color: "orange", marginBottom: "10px" }}>
      No record found — create new profile.
    </p>
  ) : (
    <p style={{ color: "green", marginBottom: "10px" }}>
      Customer profile loaded
    </p>
  )
)}

      

        

        {/* Name */}
        <FormInput
          label="Customer Name"
          type="text"
          placeholder="Enter customer name"
          value={customerName}
          onChange={onNameChange}
          error={nameError}
          required
          disabled={customerFound} // disable if found
        />

        {/* City */}
        <FormInput
          label="City"
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={onCityChange}
          disabled={customerFound}
        />

        {/* DOB */}
        <FormInput
          label="Date of Birth"
          type="date"
          value={dob}
          onChange={onDobChange}
          disabled={customerFound}
        />

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

        {/* Payment */}
        <div className="payment-section">
          <label>Payment Method</label>
          <div className="payment-options">
            <button
              className={`payment-option ${paymentMethod === "CASH" ? "active" : ""}`}
              onClick={() => onPaymentMethodChange("CASH")}
            >
              Cash
            </button>
            <button
              className={`payment-option ${paymentMethod === "UPI" ? "active" : ""}`}
              onClick={() => onPaymentMethodChange("UPI")}
            >
              UPI
            </button>
          </div>
          <p style={{ marginTop: "8px", fontSize: "0.9rem", color: "#64748b" }}>
            Razorpay checkout opens only for UPI payments.
          </p>
        </div>

        {/* Actions */}
        <div className="action-buttons">
          <button
            className="btn-success"
            onClick={onCompletePayment}
            disabled={submitting || processingPayment || !isFormValid}
          >
            {processingPayment ? "Processing..." : "Complete Payment"}
          </button>

          <button
            className="btn-primary"
            onClick={onGenerateInvoice}
            disabled={!submitting}
          >
            Generate Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;