
import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../Service/UserService";
import { FaEllipsisV } from "react-icons/fa";
import CardPanel from "../../Components/CardPanel";
import FilterSortControls from "../../Components/FilterSortControls";
import { confirmAction } from "../../Service/DeleteService";
import { getBackendErrorMessage } from "../../Service/errorMessage";

const UserList = ({ refreshFlag, onAddUserClick, onEditUserClick }) => {
  const [users, setUsers] = useState([]);

  // Controls for the filter/sort UI
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("NONE");

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(t);
  }, [search]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const sortBy = sortOrder === "NONE" ? "" : "name";
      const sortDir = sortOrder === "DESC" ? "DESC" : sortOrder === "ASC" ? "ASC" : "";
      const data = await getUsers(0, 50, debouncedSearch, roleFilter, sortBy, sortDir);
      setUsers(data.data || data || []);
    } catch (err) {
      setError(getBackendErrorMessage(err, "Unable to load users"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [refreshFlag, debouncedSearch, roleFilter, sortOrder]);

  const handleDelete = async (id) => {

    const ok=await confirmAction("Are you sure?","This user will be deleted!");
    
    if(!ok){
      return;
    }

    await deleteUser(id);
    loadUsers();
  };

  return (
    <CardPanel title="Manage Users" className="fade-expand">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <div className="text-muted" style={{ fontSize: "0.9rem" }}>
            All registered customers in your store
          </div>
        </div>
        <button
          type="button"
          className="btn btn-primary d-flex align-items-center"
          onClick={onAddUserClick}
        >
          <span className="me-1">+</span> Add User
        </button>
      </div>

      <FilterSortControls
        search={search}
        onSearchChange={setSearch}
        roleFilter={roleFilter}
        onRoleChange={setRoleFilter}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        className="mb-2"
      />

      {loading && <div className="text-muted">Loading users…</div>}
      {error && <div className="text-danger mb-2">{error}</div>}

      {!loading && users.length === 0 && (
        <div className="text-muted">No users found.</div>
      )}

      {!loading &&
        users.map((user) => {
          const initials =
            (user.name || "")
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((n) => n[0]?.toUpperCase())
              .join("") || "?";

          return (
            <div
              key={user.userId}
              className="d-flex justify-content-between align-items-center rounded-3 p-3 mb-2"
              style={{ background: "#fff", border: "1px solid #e5e7eb" }}
            >
              <div className="d-flex align-items-center">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: 40,
                    height: 40,
                    background: "#0d6efd20",
                    color: "#0d6efd",
                    fontWeight: 600,
                  }}
                >
                  {initials}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{user.name}</div>
                  <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                    {user.email}
                  </div>
                </div>
              </div>

              <div className="dropdown">
                <button
                  className="btn btn-light btn-sm rounded-circle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FaEllipsisV size={14} />
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button
                      className="dropdown-item"
                      type="button"
                      onClick={() => onEditUserClick(user)}
                    >
                      Edit
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      type="button"
                      onClick={() => handleDelete(user.userId)}
                    >
                      Delete
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          );
        })}
    </CardPanel>
  );
};

export default UserList;