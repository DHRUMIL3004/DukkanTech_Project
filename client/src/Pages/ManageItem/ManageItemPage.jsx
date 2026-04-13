import { useState } from "react";
import ManagementLayout from "../../Components/ManagementLayout";
import ItemForm from "../../Modules/Items/ItemForm";
import ItemList from "../../Modules/Items/ItemList";
import { FaBoxOpen } from "react-icons/fa";
import Footer from "../../Components/Footer/Footer";

const ManageItemPage = () => {
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const refreshItems = () => {
    setRefreshFlag((prev) => !prev);
  };

  const handleEditItemClick = (item) => {
    setEditingItem(item);
  };

  const handleEditComplete = () => {
    setEditingItem(null);
  };

  return (
    <>
      <ManagementLayout
        title="Manage Items"
        Icon={FaBoxOpen}
        left={
          <ItemForm
            refreshItems={refreshItems}
            editingItem={editingItem}
            onEditComplete={handleEditComplete}
          />
        }
        right={
          <ItemList
            refreshFlag={refreshFlag}
            onEditItemClick={handleEditItemClick}
          />
        }
      />
      <Footer />
    </>
  );
};

export default ManageItemPage;
