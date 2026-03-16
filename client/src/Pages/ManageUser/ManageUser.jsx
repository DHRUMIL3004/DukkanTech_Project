import { useState } from "react";
import ManagementLayout from "../../Components/Common/ManagementLayout";
import UserForm from "../../Components/Users/UserForm";
import UserList from "../../Components/Users/UserList";
import { FaUsers } from "react-icons/fa";

const ManageUser = () => {
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const refreshUsers = () => {
    setRefreshFlag((prev) => !prev);
  };

  return (
    <ManagementLayout
      title="Manage Users"
      Icon={FaUsers}
      fullWidth
      left={
        <>
          <UserList
            refreshFlag={refreshFlag}
            onAddUserClick={() => setShowForm(true)}
          />

          {/* Modal for creating a new user */}
          {showForm && (
            <div
              className="modal fade show"
              style={{ display: "block", background: "rgba(15,23,42,0.35)" }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Add User</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowForm(false)}
                    />
                  </div>
                  <div className="modal-body">
                    <UserForm
                      refreshUsers={() => {
                        refreshUsers();
                        setShowForm(false);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      }
    />
  );
};

export default ManageUser;