import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../Service/UserService";
import { FaTrash } from "react-icons/fa";
import CardPanel from "../Common/CardPanel";
import FilterSortControls from "../Common/FilterSortControls";

const UserList = ({ refreshFlag }) => {
  // Raw list returned from the API (not filtered/sorted)
  const [allUsers, setAllUsers] = useState([]);

  // Filtered/sorted list shown in the UI
  const [users, setUsers] = useState([]);

  // Controls for the filter/sort UI
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("NONE");

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter by search term (name) and role.
  // This is kept separate from sorting so they can be composed.
  const applyFilters = (list, term, role) => {
    const normalized = term.trim().toLowerCase();

    return list.filter((u) => {
      const matchesName = !normalized || u.name?.toLowerCase().includes(normalized);
      const matchesRole = role === "ALL" || u.role === role;
      return matchesName && matchesRole;
    });
  };

  // Sort list by name based on selected order.
  // Returns a new array so we don't mutate state directly.
  const applySort = (list, order) => {
    if (order === "NONE") return list;

    return [...list].sort((a, b) => {
      const nameA = (a.name || "").toLowerCase();
      const nameB = (b.name || "").toLowerCase();
      if (nameA === nameB) return 0;
      const comparison = nameA < nameB ? -1 : 1;
      return order === "ASC" ? comparison : -comparison;
    });
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsers();
      const usersData = data.data || data;
      setAllUsers(usersData);
      setUsers(applySort(applyFilters(usersData, search, roleFilter), sortOrder));
    } catch (err) {
      setError(err.response?.data || err.message || "Unable to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [refreshFlag]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setUsers(
        applySort(applyFilters(allUsers, search, roleFilter), sortOrder)
      );
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, roleFilter, allUsers, sortOrder]);

  const handleDelete = async (id) => {
    await deleteUser(id);
    loadUsers();
  };

  return (
    <CardPanel title="Users" className="fade-expand">
      <FilterSortControls
        search={search}
        onSearchChange={setSearch}
        roleFilter={roleFilter}
        onRoleChange={setRoleFilter}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />

      {loading && <div className="text-muted">Loading users…</div>}
      {error && <div className="text-danger mb-2">{error}</div>}

      {!loading && users.length === 0 && (
        <div className="text-muted">No users found.</div>
      )}

      {!loading &&
        users.map((user) => (
          <div
            key={user.userId}
            className="d-flex justify-content-between align-items-center border rounded p-3 mb-2"
          >
            <div>
              <strong>{user.name}</strong>
              <div className="text-muted">{user.email}</div>
            </div>

            <FaTrash
              color="#dc3545"
              size={18}
              style={{ cursor: "pointer" }}
              title="Delete user"
              onClick={() => handleDelete(user.userId)}
            />
          </div>
        ))}
    </CardPanel>
  );
};

export default UserList;