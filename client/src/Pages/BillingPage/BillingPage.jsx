import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getItems } from "../../Service/ItemService";
import NavBar from "../../Components/NavBar/NavBar";
import { FaShoppingCart, FaSearch, FaFilter } from "react-icons/fa";
import "./BillingPage.css";
import { toast } from "react-toastify";

const BillingPage = () => {
  const navigate = useNavigate();

  // Items from API
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search, filter, sort
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);

  // Cart
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("billingCart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("billingCart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch items on mount
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {

      const itemsData = await getItems();

      console.log("API RESPONSE:", itemsData);

      setItems(itemsData);
      setFilteredItems(itemsData);

      // Extract categories
      const uniqueCategories = [
        ...new Set(itemsData.map(item => item.categoryName).filter(Boolean))
      ];

      setCategories(uniqueCategories);

    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort items
  useEffect(() => {
    let result = [...items];

    // Search filter
    if (searchTerm.trim()) {
      result = result.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(item => {
        const categoryName = item.categoryName;
        return selectedCategories.includes(categoryName);
      });
    }

    // Sort
    switch (sortBy) {
      case "name-asc":
        result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "name-desc":
        result.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        break;
      case "price-asc":
        result.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
        break;
      case "price-desc":
        result.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
        break;
      default:
        break;
    }

    setFilteredItems(result);
  }, [searchTerm, sortBy, selectedCategories, items]);

  // Add to cart
  const addToCart = (item) => {
    const existingItem = cartItems.find(ci => ci.itemId === item.itemId);

    // Prevent over-adding
    if (existingItem && existingItem.quantity >= item.quantity) {
      toast.error("Stock limit reached");
      return;
    }

    if (existingItem) {
      setCartItems(cartItems.map(ci =>
        ci.itemId === item.itemId
          ? { ...ci, quantity: ci.quantity + 1 }
          : ci
      ));

      toast.info(`${item.name} quantity increased `);
    } else {
      setCartItems([
        ...cartItems,
        {
          itemId: item.itemId,
          itemName: item.name,
          price: parseFloat(item.price) || 0,
          tax: parseFloat(item.tax) || 0,
          quantity: 1,
          image: item.imgUrl,
          availableQuantity: item.quantity
        }
      ]);

      toast.success(`${item.name} added to cart `);
    }
  };
  // Total cart items count
  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Navigate to cart page
  const goToCart = () => {
    navigate("/billing/cart");
  };

  // Toggle category filter
  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Check stock status
  const getStockStatus = (item) => {
    const stock = item.quantity || 0;;
    if (stock <= 0) return { text: "Out of stock", inStock: false };
    return { text: `${stock} in stock`, inStock: true };
  };

  return (
    <>
      <NavBar />
      <div className="billing-page">
        <div className="billing-container">
          {/* Header */}
          <div className="billing-header">
            <div className="header-text">
              <h1>Billing & Shopping</h1>
              <p>Browse our products and add them to your cart</p>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="controls-bar">
            {/* Search */}
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Button */}
            <div className="filter-wrapper">
              <button
                className={`filter-btn ${selectedCategories.length > 0 ? "active" : ""}`}
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              >
                <FaFilter />
                <span>Filter</span>
                {selectedCategories.length > 0 && (
                  <span className="filter-count">{selectedCategories.length}</span>
                )}
              </button>

              {showFilterDropdown && (
                <div className="filter-dropdown">
                  <div className="filter-header">
                    <span>Categories</span>
                    {selectedCategories.length > 0 && (
                      <button onClick={() => setSelectedCategories([])}>Clear all</button>
                    )}
                  </div>
                  <div className="filter-options">
                    {categories.map(category => (
                      <label key={category} className="filter-option">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                        />
                        <span>{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </select>

            {/* Cart Button */}
            <button className="cart-btn" onClick={goToCart}>
              <FaShoppingCart />
              <span>Cart</span>
              {totalCartItems > 0 && (
                <span className="cart-badge">{totalCartItems}</span>
              )}
            </button>
          </div>

          {/* Products Count */}
          <div className="products-count">
            Showing {filteredItems.length} of {items.length} products
          </div>

          {/* Products Grid */}
          <div className="products-grid">
            {loading ? (
              <div className="loading-state">Loading products...</div>
            ) : filteredItems.length === 0 ? (
              <div className="empty-state">No products found</div>
            ) : (
              filteredItems.map(item => {
                const stockStatus = getStockStatus(item);
                const categoryName = item.category?.name || item.categoryName || "General";

                return (
                  <div key={item.itemId} className="product-card">
                    <div className="product-image">
                      {item.imgUrl ? (
                        <img
                          src={item.imgUrl}
                          alt={item.name}
                          onError={(e) => {
                            e.target.src = "/placeholder.png";
                          }}
                        />
                      ) : null}
                      <div className="image-placeholder" style={{ display: item.imgUrl ? 'none' : 'flex' }}>
                        {item.name?.charAt(0) || "P"}
                      </div>
                    </div>

                    <div className="product-info">
                      <div className="product-header">
                        <h3 className="product-name">{item.name}</h3>
                        <span className="product-category">{categoryName}</span>
                      </div>

                      <p className="product-description">
                        {item.description || "No description available"}
                      </p>

                      <div className="product-footer">
                        <span className="product-price">₹{parseFloat(item.price).toFixed(2)}</span>
                        <span className={`stock-status ${stockStatus.inStock ? "in-stock" : "out-of-stock"}`}>
                          {stockStatus.text}
                        </span>

                      </div>

                      <button
                        className={`add-to-cart-btn ${!stockStatus.inStock ? "disabled" : ""}`}
                        onClick={() => addToCart(item)}
                        disabled={
                          !stockStatus.inStock ||
                          cartItems.find(ci => ci.itemId === item.itemId)?.quantity >= item.quantity
                        }
                      >
                        <FaShoppingCart />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BillingPage;
