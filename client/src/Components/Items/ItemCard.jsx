const ItemCard = ({item,deleteItem}) => {

  return(

    <div className="card mb-2 shadow-sm">

      <div className="card-body d-flex justify-content-between">

        <div>

          <strong>{item.name}</strong>

          <div className="text-muted">
            Price : ₹{item.price}
          </div>

        </div>

        <button
  className="btn btn-danger btn-sm"
  onClick={() => deleteItem(item.id)}
>
  Delete
</button>

      </div>

    </div>

  )

}

export default ItemCard