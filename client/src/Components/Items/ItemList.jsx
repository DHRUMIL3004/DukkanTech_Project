import { useEffect, useMemo, useState } from "react";

import ItemCard from "./ItemCard";
import ItemSearch from "./ItemSearch";
import { deleteItem, getItems } from "../../Service/ItemService";

const ItemList = ({ refreshFlag }) => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("NONE"); // NONE | ASC | DESC

  const loadItems = () => {
    getItems(0, 1000).then((response) => {
      // Handle paginated response - extract data array
      if (response && response.data && Array.isArray(response.data)) {
        setItems(response.data);
      } else if (Array.isArray(response)) {
        setItems(response);
      } else {
        setItems([]);
      }
    });
  };

  useEffect(() => {
    loadItems();
  }, [refreshFlag]);

  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];

    // Search by name
    const term = search.trim().toLowerCase();
    if (term) {
      result = result.filter((item) =>
        item.name?.toLowerCase().includes(term)
      );
    }

    // Filter by category
    if (categoryFilter !== "ALL") {
      result = result.filter((item) => item.categoryId === categoryFilter);
    }

    // Sort by name
    if (sortOrder !== "NONE") {
      result.sort((a, b) => {
        const nameA = (a.name || "").toLowerCase();
        const nameB = (b.name || "").toLowerCase();
        if (nameA === nameB) return 0;
        const cmp = nameA < nameB ? -1 : 1;
        return sortOrder === "ASC" ? cmp : -cmp;
      });
    }

    return result;
  }, [items, search, categoryFilter, sortOrder]);

  const handleDelete = (id) => {
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

        {filteredAndSortedItems.map((item) => (
          <ItemCard
            key={item.itemId}
            item={item}
            deleteItem={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default ItemList;
