import { useEffect, useState } from "react";
import { getCategories, deleteCategory } from "../../Service/CategoryService";
import { FaTrash } from "react-icons/fa";
import CardPanel from "../Common/CardPanel";

const CategoryList = ({ refreshFlag }) => {
  const [allCategories, setAllCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategories();
      const list = data.data || data;
      setAllCategories(list);
      setCategories(
        list.filter((c) =>
          c.name?.toLowerCase().includes(search.trim().toLowerCase())
        )
      );
    } catch (err) {
      setError(err.response?.data || err.message || "Unable to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [refreshFlag]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCategories(
        allCategories.filter((c) =>
          c.name?.toLowerCase().includes(search.trim().toLowerCase())
        )
      );
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, allCategories]);

  const handleDelete = async (id) => {
    await deleteCategory(id);
    loadCategories();
  };

  return (
    <CardPanel title="Categories" className="fade-expand">
      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Search category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <div className="text-muted">Loading categories…</div>}
      {error && <div className="text-danger mb-2">{error}</div>}

      {!loading && categories.length === 0 && (
        <div className="text-muted">No categories found.</div>
      )}

      {!loading &&
        categories.map((cat) => (
          <div
            key={cat.categoryId}
            className="d-flex justify-content-between align-items-center border rounded p-3 mb-2"
            style={{ background: cat.bgColor || "white" }}
          >
            <div className="d-flex align-items-center">
                  {cat.imgUrl && (
                <img
                  src={cat.imgUrl}
                  alt={cat.name}
                  width={40}
                  height={40}
                  className="me-2"
                />
              )}
              <div>
                <strong>{cat.name}</strong>
                <div className="text-muted">0 Items</div>
              </div>
            </div>

            <FaTrash
              color="#dc3545"
              size={18}
              style={{ cursor: "pointer" }}
              title="Delete category"
              onClick={() => handleDelete(cat.categoryId)}
            />
          </div>
        ))}
    </CardPanel>
  );
};

export default CategoryList;
