import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import "./Billing.css";

const CartItemRow = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="cart-item-row">
      <div className="col-product">
        <span className="product-name">{item.itemName}</span>
      </div>

      <div className="col-price">
        <span>₹{item.price.toFixed(2)}</span>
      </div>

      <div className="col-qty">
        <div className="qty-control">
          <button
            className="qty-btn"
            onClick={() => onUpdateQuantity(item.itemId, item.quantity - 1)}
          >
            <FaMinus />
          </button>
          <span className="qty-value">{item.quantity}</span>
          <button
            className="qty-btn"
            onClick={() => onUpdateQuantity(item.itemId, item.quantity + 1)}
          >
            <FaPlus />
          </button>
        </div>
      </div>

      <div className="col-total">
        <span className="item-total">
          ₹{(item.price * item.quantity).toFixed(2)}
        </span>
      </div>

      <div className="col-action">
        <button className="delete-btn" onClick={() => onRemove(item.itemId)}>
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default CartItemRow;
