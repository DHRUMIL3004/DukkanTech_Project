import { FaFilter } from "react-icons/fa";
import "./Billing.css";

const FilterDropdown = ({
  categories,
  selectedCategories,
  onToggleCategory,
  onClearAll,
  isOpen,
  onToggleOpen,
}) => {
  return (
    <div className="filter-wrapper">
      <button
        className={`filter-btn ${selectedCategories.length > 0 ? "active" : ""}`}
        onClick={onToggleOpen}
      >
        <FaFilter />
        <span>Filter</span>
        {selectedCategories.length > 0 && (
          <span className="filter-count">{selectedCategories.length}</span>
        )}
      </button>

      {isOpen && (
        <div className="filter-dropdown">
          <div className="filter-header">
            <span>Categories</span>
            {selectedCategories.length > 0 && (
              <button onClick={onClearAll}>Clear all</button>
            )}
          </div>
          <div className="filter-options">
            {categories.map((category) => (
              <label key={category} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => onToggleCategory(category)}
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
