import { useEffect, useState } from "react";

import { createItem } from "../../Service/ItemService";
import { getCategories } from "../../Service/CategoryService";


const ItemForm = ({ refreshItems }) => {

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
      setCategories(res.data.content || res.data);
    })

  }, [])


  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value })
  }


  const handleSubmit = (e) => {
    e.preventDefault();

    createItem(item, file)
      .then(() => {
        alert("Item Created");
        refreshItems();
        setItem(emptyItem);
        setFile(null);
       
      })
      .catch(() => {
        alert("Error creating item");
      })
     
      
  }

  return (

    <div className="card shadow-sm">

      <div className="card-body">

        <h5 className="mb-3">Create Item</h5>

        <form onSubmit={handleSubmit}>

          {/* ITEM NAME */}

          <div className="mb-3">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Item Name"
              onChange={handleChange}
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
              onChange={handleChange}
            />
          </div>


          {/* QUANTITY */}

          <div className="mb-3">
            <input
              type="number"
              name="quantity"
              className="form-control"
              placeholder="Quantity"
              onChange={handleChange}
            />
          </div>

          {/* DESCRIPTION */}

          <div className="mb-3">
            <textarea
              name="description"
              className="form-control"
              placeholder="Description"
              onChange={handleChange}
            />
          </div>

          {/* IMAGE */}

          <div className="mb-3 text-center">
            <input
              type="file"
              className="form-control"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <button className="btn btn-primary w-100">
            Submit
          </button>

        </form>

      </div>

    </div>
  )
}

export default ItemForm;