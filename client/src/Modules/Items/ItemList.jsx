import { useEffect, useMemo, useState } from "react";

import ItemCard from "./ItemCard";
import ItemSearch from "./ItemSearch";
import { deleteItem, getItems } from "../../Service/ItemService";
import { confirmAction } from "../../Service/DeleteService";
import Loader from "../../Components/Loader";

const ItemList = ({ refreshFlag, onEditItemClick }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("NONE"); // NONE | ASC | DESC

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(t);
  }, [search]);

  const loadItems = () => {
    setLoading(true);
    const sortBy = sortOrder === "NONE" ? "" : "name";
    const sortDir =
      sortOrder === "DESC" ? "DESC" : sortOrder === "ASC" ? "ASC" : "";
    getItems(0, 1000, debouncedSearch, categoryFilter, sortBy, sortDir)
      .then((response) => {
        if (response && response.data && Array.isArray(response.data)) {
          setItems(response.data);
        } else if (Array.isArray(response)) {
          setItems(response);
        } else {
          setItems([]);
        }
      })
      .catch((error) => {
        console.error("Error loading items:", error);
        setItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadItems();
  }, [refreshFlag, debouncedSearch, categoryFilter, sortOrder]);

  const handleDelete = async (id) => {
    const ok = await confirmAction(
      "Are you sure?",
      "This item will be deleted!",
    );

    if (!ok) {
      return;
    }

    if (!id) {
      console.error("Item id missing");
      return;
    }

    deleteItem(id).then(() => {
      loadItems();
    });
  };

  // Build category options from loaded items
  const categoryOptions = useMemo(() => {
    const map = new Map();
    items.forEach((item) => {
      if (item.categoryId && item.categoryName) {
        map.set(item.categoryId, item.categoryName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({
      id,
      name,
    }));
  }, [items]);

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="mb-3">Items</h5>

        <ItemSearch
          search={search}
          setSearch={setSearch}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          categories={categoryOptions}
        />

        {loading ? (
          <Loader message="Loading items..." />
        ) : items.length === 0 ? (
          <div className="text-muted">No items found.</div>
        ) : (
          items.map((item) => (
            <ItemCard
              key={item.itemId}
              item={item}
              deleteItem={handleDelete}
              onEditItemClick={onEditItemClick}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ItemList;
