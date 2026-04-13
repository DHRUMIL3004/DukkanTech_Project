import { FaShoppingCart } from "react-icons/fa";
import "./Billing.css";

const ProductCard = ({ item, onAddToCart, isDisabled }) => {
  const getStockStatus = () => {
    const stock = item.quantity || 0;
    if (stock <= 0) return { text: "Out of stock", inStock: false };
    return { text: `${stock} in stock`, inStock: true };
  };

  const stockStatus = getStockStatus();
  const categoryName = item.category?.name || item.categoryName || "General";

  return (
    <div className="product-card">
      <div className="product-image">
        {item.imgUrl ? (
          <img
            src={item.imgUrl}
            alt={item.name}
            onError={(e) => {
              e.target.src = "/placeholder.png";
            }}
          />
        ) : null}
        <div className="image-placeholder" style={{ display: item.imgUrl ? 'none' : 'flex' }}>
          {item.name?.charAt(0) || "P"}
        </div>
      </div>

      <div className="product-info">
        <div className="product-header">
          <h3 className="product-name">{item.name}</h3>
          <span className="product-category">{categoryName}</span>
        </div>

        <p className="product-description">
          {item.description || "No description available"}
        </p>

        <div className="product-footer">
          <span className="product-price">₹{parseFloat(item.price).toFixed(2)}</span>
          <span className={`stock-status ${stockStatus.inStock ? "in-stock" : "out-of-stock"}`}>
            {stockStatus.text}
          </span>
        </div>

        <button
          className={`add-to-cart-btn ${!stockStatus.inStock || isDisabled ? "disabled" : ""}`}
          onClick={() => onAddToCart(item)}
          disabled={!stockStatus.inStock || isDisabled}
        >
          <FaShoppingCart />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
