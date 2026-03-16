const ItemCard = ({ item, deleteItem }) => {
  return (
    <div className="card mb-2 shadow-sm">
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
            <div className="text-muted">Price : ₹{item.price}</div>
          </div>
        </div>

        <button
          className="btn btn-danger btn-sm"
          onClick={() => deleteItem(item.itemId)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ItemCard;