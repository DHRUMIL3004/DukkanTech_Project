import FormInput from "./FormInput";
import "./Billing.css";

const OrderSummary = ({
  customerName,
  phone,
  nameError,
  phoneError,
  onNameChange,
  onPhoneChange,
  subTotal,
  totalTax,
  totalAmount,
  paymentMethod,
  onPaymentMethodChange,
  onCompletePayment,
  onGenerateInvoice,
  isFormValid,
  submitting
}) => {
  return (
    <div className="order-summary-section">
      <div className="summary-card">
        <h3>Order Summary</h3>

        <FormInput
          label="Customer Name"
          type="text"
          placeholder="Enter customer name"
          value={customerName}
          onChange={onNameChange}
          error={nameError}
          required
        />

        <FormInput
          label="Phone Number"
          type="tel"
          placeholder="Enter 10-digit phone number"
          value={phone}
          onChange={onPhoneChange}
          error={phoneError}
          maxLength={10}
          required
        />

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
        </div>

        <div className="action-buttons">
          <button
            className="btn-success"
            onClick={onCompletePayment}
            disabled={submitting || !isFormValid}
          >
            Complete Payment
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
