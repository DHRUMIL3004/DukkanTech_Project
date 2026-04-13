import { IoFilterCircleSharp } from "react-icons/io5";
import { FaSort } from "react-icons/fa";

// Default role options shown in the filter dropdown.
// This array can be overridden via the `roles` prop if a parent needs a different set.
const defaultRoles = [
  { value: "ALL", label: "All roles" },
  { value: "ADMIN", label: "ADMIN" },
  { value: "EMPLOYEE", label: "EMPLOYEE" },
];

// A reusable filter + sort control panel.
// Props:
// - search / onSearchChange: controlled search input
// - roleFilter / onRoleChange: role dropdown state + handler
// - sortOrder / onSortChange: sort dropdown state + handler
// - roles: optional role options list (defaults to `defaultRoles`)
// - className: optional wrapper class
const FilterSortControls = ({
  search,
  onSearchChange,
  roleFilter,
  onRoleChange,
  sortOrder,
  onSortChange,
  roles = defaultRoles,
  className = "",
}) => (
  <div className={`row g-2 mb-3 align-items-center ${className}`.trim()}>
    <div className="col-10 col-sm-8 col-md-7">
      <input
        className="form-control"
        placeholder="Search user"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>

    <div className="col-auto">
      <div className="dropdown">
        <button
          className="btn btn-outline-secondary p-2"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          aria-label="Filter users by role"
        >
          <IoFilterCircleSharp size={18} />
        </button>
        <ul className="dropdown-menu dropdown-menu-end">
          {roles.map((role) => (
            <li key={role.value}>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => onRoleChange(role.value)}
              >
                {role.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>

    <div className="col-auto">
      <div className="dropdown">
        <button
          className="btn btn-outline-secondary p-2"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          aria-label="Sort users"
        >
          <FaSort size={18} />
        </button>
        <ul className="dropdown-menu dropdown-menu-end">
          <li>
            <button
              className="dropdown-item"
              type="button"
              onClick={() => onSortChange("NONE")}
            >
              No sort
            </button>
          </li>
          <li>
            <button
              className="dropdown-item"
              type="button"
              onClick={() => onSortChange("ASC")}
            >
              Name (A → Z)
            </button>
          </li>
          <li>
            <button
              className="dropdown-item"
              type="button"
              onClick={() => onSortChange("DESC")}
            >
              Name (Z → A)
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

export default FilterSortControls;