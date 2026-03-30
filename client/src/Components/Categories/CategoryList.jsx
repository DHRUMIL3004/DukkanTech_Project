import { useEffect, useState } from "react";
import {
  getCategories,
  deleteCategory,
  getItemCountByCategory,
} from "../../Service/CategoryService";
import { FaEllipsisV } from "react-icons/fa";
import CardPanel from "../Common/CardPanel";
import Logout from "../Logout/Logout";
import { Delete } from "lucide-react";
import Swal from "sweetalert2";
import { confirmAction } from "../../Service/DeleteService";
import { getBackendErrorMessage } from "../../Service/errorMessage";

const CategoryList = ({ refreshFlag, onEditCategoryClick }) => {
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
      // console.log("Loaded categories:", data.data[0].itemCount);
      setAllCategories(list);
      setCategories(
        list.filter((c) =>
          c.name?.toLowerCase().includes(search.trim().toLowerCase()),
        ),
      );
    } catch (err) {
      setError(getBackendErrorMessage(err, "Unable to load categories"));
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
          c.name?.toLowerCase().includes(search.trim().toLowerCase()),
        ),
      );
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, allCategories]);

  const handleDelete = async (id) => {
   const count = await getItemCountByCategory(id);
   
  if(count > 0){
    Swal.fire({
      icon:"info",
      title: "Cannot delete",
      text: "This category has items associated with it. Please delete those items first.",
      width:"300px",
      padding:"1.5rem"
    });
    return;
  }
      
   const ok =await confirmAction("Are you sure?", "This category will be deleted!");

   if(!ok){
    return;
   }

       await deleteCategory(id);
    loadCategories();
  }

  


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
                <div className="text-muted">Tax: {cat.tax}%</div>
                <div className="text-muted">{cat.itemCount ?? 0} Items</div>
              </div>
            </div>

            <div className="dropdown">
              <button
                className="btn btn-light btn-sm rounded-circle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <FaEllipsisV size={14} />
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button
                    className="dropdown-item"
                    type="button"
                    onClick={() => onEditCategoryClick?.(cat)}
                  >
                    Edit
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item text-danger"
                    type="button"
                    onClick={() => handleDelete(cat.categoryId)}
                  >
                    Delete
                  </button>
                </li>
              </ul>
            </div>
          </div>
        ))}
    </CardPanel>
  );
};

export default CategoryList;
