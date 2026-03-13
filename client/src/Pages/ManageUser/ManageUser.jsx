import { useState } from "react";
import ManagementLayout from "../../Components/Common/ManagementLayout";
import UserForm from "../../Components/Users/UserForm";
import UserList from "../../Components/Users/UserList";

const ManageUser = () => {

  const [refreshFlag, setRefreshFlag] = useState(false);

  const refreshUsers = () => {
    setRefreshFlag((prev) => !prev);
  };

  return (
    <ManagementLayout
      title="Manage Users"
      left={<UserForm refreshUsers={refreshUsers} />}
      right={<UserList refreshFlag={refreshFlag} />}
    />
  );
};

export default ManageUser;