import { FaEllipsisV } from "react-icons/fa";
import "./ItemCard.css";

const ItemCard = ({ item, deleteItem, onEditItemClick }) => {
  return (
    <div className="card mb-2 shadow-sm item-row-card">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          {item.imgUrl && (
            <img
              src={item.imgUrl}
              alt={item.name}
              style={{
                width: 48,
                height: 48,
                objectFit: "cover",
                borderRadius: 8,
                marginRight: 12,
              }}
            />
          )}
          <div>
            <strong>{item.name}</strong>
            <div className="text-muted" style={{ fontSize: "0.85rem" }}>
              Price: ₹{item.price} | Qty: {item.quantity ?? 0}
              {item.categoryName && <span> | {item.categoryName}</span>}
            </div>
          </div>
        </div>

        <div className="dropdown item-actions-dropdown">
          <button
            className="btn btn-light btn-sm rounded-circle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <FaEllipsisV size={14} />
          </button>
          <ul className="dropdown-menu dropdown-menu-end item-actions-menu">
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => onEditItemClick?.(item)}
              >
                Edit
              </button>
            </li>
            <li>
              <button
                className="dropdown-item text-danger"
                type="button"
                onClick={() => deleteItem(item.itemId)}
              >
                Delete
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
