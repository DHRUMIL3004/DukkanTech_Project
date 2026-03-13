import { useEffect,useState } from "react";

import ItemCard from "./ItemCard";
import ItemSearch from "./ItemSearch";
import { deleteItem, getItems } from "../../Service/ItemService";

const ItemList = () => {

  const [items,setItems] = useState([]);
  const [search,setSearch] = useState("");

  const loadItems = () => {

    getItems().then(data => {
      setItems(data?.content || data || []);
    });

  };

  useEffect(()=>{
    loadItems();
  },[]);

  const filteredItems = items.filter(item =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {

    if(!id){
      console.error("Item id missing");
      return;
    }

    deleteItem(id).then(()=>{
      loadItems();
    });

  };

  return(

    <div className="card shadow-sm">

      <div className="card-body">

        <h5 className="mb-3">Items</h5>

        <ItemSearch setSearch={setSearch}/>

        {filteredItems.map((item,index)=>(
          <ItemCard
            key={item.id || item.itemID || index}
            item={item}
            deleteItem={handleDelete}
          />
        ))}

      </div>

    </div>

  )

}

export default ItemList;