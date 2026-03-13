import { useState } from "react";
import ManagementLayout from "../../Components/Common/ManagementLayout";
import CategoryForm from "../../Components/Categories/CategoryForm";
import CategoryList from "../../Components/Categories/CategoryList";

const ManageCategory = () => {
  const [refreshFlag, setRefreshFlag] = useState(false);

  const refreshCategories = () => {
    setRefreshFlag((prev) => !prev);
  };

  return (
    <ManagementLayout
      title="Manage Categories"
      left={<CategoryForm refreshCategories={refreshCategories} />}
      right={<CategoryList refreshFlag={refreshFlag} />}
    />
  );
};

export default ManageCategory;