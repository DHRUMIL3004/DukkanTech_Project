import { useState } from "react";
import ManagementLayout from "../../Components/ManagementLayout";
import CategoryForm from "../../Modules/Categories/CategoryForm";
import CategoryList from "../../Modules/Categories/CategoryList";
import { FaTags } from "react-icons/fa";
import Footer from "../../Components/Footer/Footer";

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
    <>
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
      <Footer />
    </>
  );
};

export default ManageCategory;
