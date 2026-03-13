import { useEffect, useState } from "react";

import { createItem } from "../../Service/ItemService";
import { getCategories } from "../../Service/CategoryService";


const ItemForm = () => {

  const [categories,setCategories] = useState([]);

  const [item,setItem] = useState({
    itemID:"",
    name:"",
    price:"",
    quantity:"",
    description:"",
    categoryId:"",
    imgUrl:""
  });

  useEffect(()=>{

    getCategories().then(res=>{
      setCategories(res.data.content || res.data);
    })

  },[])


  const handleChange=(e)=>{
    setItem({...item,[e.target.name]:e.target.value})
  }


  const handleSubmit=(e)=>{
    e.preventDefault();

    createItem(item)
      .then(()=>{
        alert("Item Created");
      })
      .catch(()=>{
        alert("Error creating item");
      })
  }

  return(

    <div className="card shadow-sm">

      <div className="card-body">

        <h5 className="mb-3">Create Item</h5>

        <form onSubmit={handleSubmit}>

          {/* IMAGE */}

          <div className="mb-3 text-center">
            <input type="file" className="form-control"/>
          </div>

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

          <select className="form-select">
  {categories.map(category => (
  <option key={category.id} value={category.id}>
    {category.name}
  </option>
))}
</select>

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

          <button className="btn btn-primary w-100">
            Submit
          </button>

        </form>

      </div>

    </div>
  )
}

export default ItemForm;