import { useState } from "react";
import { createCategory } from "../../Service/CategoryService";
import CardPanel from "../Common/CardPanel";

const CategoryForm = ({ refreshCategories }) => {
  const [category, setCategory] = useState({
    name: "",
    description: "",
    bgColor: "#ffffff",
  });
  const [file, setFile] = useState(null);

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
      await createCategory(category, file);
      refreshCategories();

      setCategory({ name: "", description: "", bgColor: "#ffffff" });
      setFile(null);
      // clear file input manually - later if needed
      document.getElementById("category-image").value = "";
    } catch (error) {
      const message = Object.values(error.response.data.errors)[0];
      alert(message);
    }
  };

  return (
    <CardPanel title="Create Category" className="fade-expand">
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
            required
          />
        </div>

        <button className="btn btn-primary w-100" type="submit">
          Save
        </button>
      </form>
    </CardPanel>
  );
};

export default CategoryForm;
