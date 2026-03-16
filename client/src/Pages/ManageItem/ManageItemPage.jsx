import { useState } from "react";
import ManagementLayout from "../../Components/Common/ManagementLayout";
import ItemForm from "../../Components/Items/ItemForm";
import ItemList from "../../Components/Items/ItemList";
import { FaBoxOpen } from "react-icons/fa";

const ManageItemPage = () => {

  const [refreshFlag, setRefreshFlag] = useState(false);

  const refreshItems = () => {
    setRefreshFlag((prev) => !prev);
  };

  return (
    <ManagementLayout
      title="Manage Items"
      Icon={FaBoxOpen}
      left={<ItemForm refreshItems={refreshItems} />}
      right={<ItemList refreshFlag={refreshFlag} />}
    />
  );
};

export default ManageItemPage;