import { IoFilterCircleSharp } from "react-icons/io5";
import { FaSort } from "react-icons/fa";

const ItemSearch = ({
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  sortOrder,
  setSortOrder,
  categories = [],
}) => {
  return (
    <div className="row g-2 mb-3 align-items-center">
      <div className="col-10 col-sm-8 col-md-7">
        <input
          className="form-control"
          placeholder="Search item"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="col-auto">
        <div className="dropdown">
          <button
            className="btn btn-outline-secondary p-2"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            aria-label="Filter items by category"
          >
            <IoFilterCircleSharp size={18} />
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => setCategoryFilter("ALL")}
              >
                All categories
              </button>
            </li>
            {categories.map((c) => (
              <li key={c.id}>
                <button
                  className="dropdown-item"
                  type="button"
                  onClick={() => setCategoryFilter(c.id)}
                >
                  {c.name}
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
            aria-label="Sort items"
          >
            <FaSort size={18} />
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => setSortOrder("NONE")}
              >
                No sort
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => setSortOrder("ASC")}
              >
                Name (A → Z)
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => setSortOrder("DESC")}
              >
                Name (Z → A)
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ItemSearch;