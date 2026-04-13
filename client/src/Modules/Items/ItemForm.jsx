import { useEffect, useState } from "react";

import { createItem, updateItem } from "../../Service/ItemService";
import { getCategories } from "../../Service/CategoryService";
import { getBackendErrorMessage } from "../../Service/errorMessage";


const ItemForm = ({ refreshItems, editingItem, onEditComplete }) => {

  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);

  const emptyItem = {
    itemId: "",
    name: "",
    price: "",
    quantity: "",
    description: "",
    categoryId: "",
    imgUrl: ""
  };

  const [item, setItem] = useState(emptyItem);

  useEffect(() => {

    getCategories().then(res => {
      const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      setCategories(list);
    })

  }, [])

  useEffect(() => {
    if (editingItem) {
      setItem({
        itemId: editingItem.itemId || "",
        name: editingItem.name || "",
        price: editingItem.price ?? "",
        quantity: editingItem.quantity ?? "",
        description: editingItem.description || "",
        categoryId: editingItem.categoryId || "",
        imgUrl: editingItem.imgUrl || "",
      });
      setFile(null);
      const imageInput = document.getElementById("item-image");
      if (imageInput) {
        imageInput.value = "";
      }
    }
  }, [editingItem]);


  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value })
  }


  const handleSubmit = (e) => {
    e.preventDefault();

    const action = editingItem
      ? updateItem(editingItem.itemId, item, file)
      : createItem(item, file);

    action
      .then(() => {
        alert(editingItem ? "Item Updated" : "Item Created");
        refreshItems();
        setItem(emptyItem);
        setFile(null);
        const imageInput = document.getElementById("item-image");
        if (imageInput) {
          imageInput.value = "";
        }
        onEditComplete?.();
       
      })
      .catch((error) => {
        alert(getBackendErrorMessage(error, editingItem ? "Error updating item" : "Error creating item"));
      })
     
      
  }

  return (

    <div className="card shadow-sm">

      <div className="card-body">

        <h5 className="mb-3">{editingItem ? "Edit Item" : "Create Item"}</h5>

        <form onSubmit={handleSubmit}>

          {/* ITEM NAME */}

          <div className="mb-3">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Item Name"
              value={item.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* CATEGORY */}

          <div className="mb-3">
            <select
              className="form-select"
              name="categoryId"
              value={item.categoryId}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option
                  key={category.categoryId}
                  value={category.categoryId}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* PRICE */}

          <div className="mb-3">
            <input
              type="number"
              name="price"
              className="form-control"
              placeholder="Price"
              value={item.price}
              onChange={handleChange}
              required
            />
          </div>


          {/* QUANTITY */}

          <div className="mb-3">
            <input
              type="number"
              name="quantity"
              className="form-control"
              placeholder="Quantity"
              value={item.quantity}
              onChange={handleChange}
              required
            />
          </div>

          {/* DESCRIPTION */}

          <div className="mb-3">
            <textarea
              name="description"
              className="form-control"
              placeholder="Description"
              value={item.description}
              onChange={handleChange}
            />
          </div>

          {/* IMAGE */}

          <div className="mb-3 text-center">
            <input
              type="file"
              className="form-control"
              id="item-image"
              onChange={(e) => setFile(e.target.files[0])}
              required={!editingItem}
            />
          </div>

          <button className="btn btn-primary w-100">
            {editingItem ? "Update" : "Submit"}
          </button>

          {editingItem && (
            <button
              type="button"
              className="btn btn-outline-secondary w-100 mt-2"
              onClick={() => {
                setItem(emptyItem);
                setFile(null);
                const imageInput = document.getElementById("item-image");
                if (imageInput) {
                  imageInput.value = "";
                }
                onEditComplete?.();
              }}
            >
              Cancel Edit
            </button>
          )}

        </form>

      </div>

    </div>
  )
}

export default ItemForm;