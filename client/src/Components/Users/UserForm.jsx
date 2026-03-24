import { useState, useEffect } from "react";
import { createUser, updateUser } from "../../Service/UserService";
import CardPanel from "../Common/CardPanel";

const UserForm = ({ refreshUsers, editingUser, onEditComplete }) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });

  useEffect(() => {
    if (editingUser) {
      setUser({
        name: editingUser.name || "",
        email: editingUser.email || "",
        role: editingUser.role || "",
        password: "",
      });
    }
  }, [editingUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Prevent immutable fields during edit mode
    if (editingUser && (name === "email" || name === "role")) {
      return;
    }
    
    setUser({
      ...user,
      [name]: value
    });
  };

  const getErrorMessage = (error) => {

    console.log(error);
  
    if (!error.response) {
      return "Server not responding";
    }
  
    const data = error.response.data;
  
    if (data?.errors?.message) {
      return data.errors.message;
    }
  
    if (data?.errors) {
      return Object.values(data.errors)[0];
    }
  
    if (data?.message) {
      return data.message;
    }
  
    return "Something went wrong";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      if (editingUser) {
        // Update existing user
        await updateUser(editingUser.userId, user);
      } else {
        // Create new user
        await createUser(user);
      }
      
      refreshUsers();
  
      setUser({
        name: "",
        email: "",
        role: "",
        password: ""
      });

      if (onEditComplete) {
        onEditComplete();
      }
  
    } catch (error) {
      const message = getErrorMessage(error);
      alert(message);
    }
  };

  return (
    <CardPanel title={editingUser ? "Edit User" : "Create User"} className="fade-expand">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            placeholder="Name"
            name="name"
            value={user.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            name="email"
            value={user.email}
            onChange={handleChange}
            disabled={editingUser ? true : false}
            style={editingUser ? { backgroundColor: "#f5f5f5", cursor: "not-allowed" } : {}}
            required
          />
          {editingUser && (
            <small className="text-muted">Email cannot be changed</small>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Role</label>
          <select
            className="form-select"
            name="role"
            value={user.role}
            onChange={handleChange}
            disabled={editingUser ? true : false}
            style={editingUser ? { backgroundColor: "#f5f5f5", cursor: "not-allowed" } : {}}
            required
          >
            <option value="">Select Role</option>
            <option value="ADMIN">ADMIN</option>
            <option value="EMPLOYEE">EMPLOYEE</option>
          </select>
          {editingUser && (
            <small className="text-muted">Role cannot be changed</small>
          )}
        </div>

        <div className="mb-4">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder={editingUser ? "Leave blank to keep current password" : "Password"}
            name="password"
            value={user.password}
            onChange={handleChange}
            required={!editingUser}
          />
        </div>

        <button className="btn btn-primary w-100" type="submit">
          {editingUser ? "Update User" : "Create User"}
        </button>
      </form>
    </CardPanel>
  );
};

export default UserForm;