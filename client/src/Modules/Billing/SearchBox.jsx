import { FaSearch } from "react-icons/fa";
import "./Billing.css";

const SearchBox = ({ value, onChange, placeholder = "Search products..." }) => {
  return (
    <div className="search-box">
      <FaSearch className="search-icon" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBox;
