import { useState } from "react";
import ManagementLayout from "../../Components/Common/ManagementLayout";
import CategoryForm from "../../Components/Categories/CategoryForm";
import CategoryList from "../../Components/Categories/CategoryList";
import { FaTags } from "react-icons/fa";

const ManageCategory = () => {
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const refreshCategories = () => {
    setRefreshFlag((prev) => !prev);
  };

  const handleEditCategoryClick = (category) => {
    setEditingCategory(category);
  };

  const handleEditComplete = () => {
    setEditingCategory(null);
  };

  return (
    <ManagementLayout
      title="Manage Categories"
      Icon={FaTags}
      left={
        <CategoryForm
          refreshCategories={refreshCategories}
          editingCategory={editingCategory}
          onEditComplete={handleEditComplete}
        />
      }
      right={
        <CategoryList
          refreshFlag={refreshFlag}
          onEditCategoryClick={handleEditCategoryClick}
        />
      }
    />
  );
};

export default ManageCategory;