import { useState } from "react";
import ManagementLayout from "../../Components/Common/ManagementLayout";
import UserForm from "../../Components/Users/UserForm";
import UserList from "../../Components/Users/UserList";
import { FaUsers } from "react-icons/fa";
import Footer from "../../Components/Footer/Footer";

const ManageUser = () => {

  const [refreshFlag, setRefreshFlag] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const refreshUsers = () => {
    setRefreshFlag((prev) => !prev);
  };

  const handleAddUserClick = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEditUserClick = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleEditComplete = () => {
    setEditingUser(null);
    setShowForm(false);
  };

  return (
      <>
    <ManagementLayout
      title="Manage Users"
      Icon={FaUsers}
      fullWidth
      left={
        <>
          <UserList
            refreshFlag={refreshFlag}
            onAddUserClick={handleAddUserClick}
            onEditUserClick={handleEditUserClick}
          />

          {/* Modal for creating/editing a user */}
          {showForm && (
            <div
              className="modal fade show"
              style={{ display: "block", background: "rgba(15,23,42,0.35)" }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {editingUser ? "Edit User" : "Add User"}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => {
                        setShowForm(false);
                        setEditingUser(null);
                      }}
                    />
                  </div>
                  <div className="modal-body">
                    <UserForm
                      refreshUsers={() => {
                        refreshUsers();
                      }}
                      editingUser={editingUser}
                      onEditComplete={handleEditComplete}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </>
      }
    />
      <Footer />
      </>
  );
};

export default ManageUser;