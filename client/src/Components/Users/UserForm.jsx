import { useState, useEffect } from "react";
import { createUser, updateUser } from "../../Service/UserService";
import CardPanel from "../Common/CardPanel";
import { getBackendErrorMessage } from "../../Service/errorMessage";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingUser) {
        // Update existing user
        await updateUser(editingUser.userId, { name: user.name });
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
      const message = getBackendErrorMessage(error, "Server not responding");
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

        {!editingUser && (
          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              name="password"
              value={user.password}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <button className="btn btn-primary w-100" type="submit">
          {editingUser ? "Update User" : "Create User"}
        </button>
      </form>
    </CardPanel>
  );
};

export default UserForm;