import { useEffect, useState } from "react";
import { createCategory, updateCategory } from "../../Service/CategoryService";
import CardPanel from "../Common/CardPanel";
import { getBackendErrorMessage } from "../../Service/errorMessage";

const CategoryForm = ({ refreshCategories, editingCategory, onEditComplete }) => {
  const [category, setCategory] = useState({
    name: "",
    description: "",
    bgColor: "#ffffff",
    tax: "",
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (editingCategory) {
      setCategory({
        name: editingCategory.name || "",
        description: editingCategory.description || "",
        bgColor: editingCategory.bgColor || "#ffffff",
        tax: editingCategory.tax ?? "",
      });
      setFile(null);
    }
  }, [editingCategory]);

  const handleChange = (e) => {
    setCategory({
      ...category,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.categoryId, category, file);
      } else {
        await createCategory(category, file);
      }
      refreshCategories();

      setCategory({ name: "", description: "", bgColor: "#ffffff" ,tax:""});
      setFile(null);
      // clear file input manually - later if needed
      document.getElementById("category-image").value = "";

      if (onEditComplete) {
        onEditComplete();
      }
    } catch (error) {
      alert(getBackendErrorMessage(error, "Unable to save category"));
    }
  };

  return (
    <CardPanel title={editingCategory ? "Edit Category" : "Create Category"} className="fade-expand">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            placeholder="Category Name"
            name="name"
            value={category.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            placeholder="Description"
            name="description"
            value={category.description}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Tax % </label>
          <input
            type="number"
            className="form-control"
            placeholder="Tax Percentage"
            name="tax"
            value={category.tax}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Background Colour</label>
          <input
            type="color"
            className="form-control form-control-color"
            name="bgColor"
            value={category.bgColor}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Image</label>
          <input
            className="form-control"
            type="file"
            id="category-image"
            accept="image/*"
            onChange={handleFileChange}
            required={!editingCategory}
          />
        </div>

        <button className="btn btn-primary w-100" type="submit">
          {editingCategory ? "Update" : "Save"}
        </button>

        {editingCategory && (
          <button
            className="btn btn-outline-secondary w-100 mt-2"
            type="button"
            onClick={() => {
              setCategory({ name: "", description: "", bgColor: "#ffffff", tax: "" });
              setFile(null);
              document.getElementById("category-image").value = "";
              onEditComplete?.();
            }}
          >
            Cancel Edit
          </button>
        )}
      </form>
    </CardPanel>
  );
};

export default CategoryForm;