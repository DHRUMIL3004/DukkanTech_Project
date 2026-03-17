/**
 * BillingPage - Main product listing page with cart functionality
 * Uses server-side pagination to fetch items from backend API
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getItems } from "../../Service/ItemService";
import NavBar from "../../Components/NavBar/NavBar";
import { FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  SearchBox,
  FilterDropdown,
  ProductCard,
  Pagination
} from "../../Components/Billing";
import "./BillingPage.css";

const BillingPage = () => {
  const navigate = useNavigate();

  // ============ STATE MANAGEMENT ============
  
  // Product data from API
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search and filter controls
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);

  // Cart state (persisted in localStorage)
  const [cartItems, setCartItems] = useState([]);

  // Pagination state (0-indexed for API)
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const itemsPerPage = 12;

  // ============ EFFECTS ============

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("billingCart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Persist cart to localStorage on change
  useEffect(() => {
    localStorage.setItem("billingCart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch products when page changes
  useEffect(() => {
    fetchItems(currentPage);
  }, [currentPage]);

  // Apply client-side filtering and sorting when data or filters change
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
      result = result.filter(item => selectedCategories.includes(item.categoryName));
    }

    // Sorting
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

  // ============ API FUNCTIONS ============

  // Fetch paginated items from backend
  const fetchItems = async (page) => {
    setLoading(true);
    try {
      const response = await getItems(page, itemsPerPage);

      if (response && response.data) {
        setItems(response.data);
        setFilteredItems(response.data);
        setTotalPages(response.totalPages || 0);
        setTotalElements(response.totalElements || 0);

        // Extract unique categories for filter dropdown
        const uniqueCategories = [
          ...new Set(response.data.map(item => item.categoryName).filter(Boolean))
        ];
        setCategories(prev => [...new Set([...prev, ...uniqueCategories])]);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  // ============ CART FUNCTIONS ============

  // Add item to cart or increase quantity if already exists
  const addToCart = (item) => {
    const existingItem = cartItems.find(ci => ci.itemId === item.itemId);

    // Check stock limit
    if (existingItem && existingItem.quantity >= item.quantity) {
      toast.error("Stock limit reached");
      return;
    }

    if (existingItem) {
      // Increase quantity
      setCartItems(cartItems.map(ci =>
        ci.itemId === item.itemId
          ? { ...ci, quantity: ci.quantity + 1 }
          : ci
      ));
      toast.info(`${item.name} quantity increased`);
    } else {
      // Add new item
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
      toast.success(`${item.name} added to cart`);
    }
  };

  // ============ PAGINATION HANDLERS ============

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalElements);

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Toggle category in filter
  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // ============ RENDER ============

  return (
    <>
      <NavBar />
      <div className="billing-page">
        <div className="billing-container">
          
          {/* Page Header */}
          <div className="billing-header">
            <div className="header-text">
              <h1>Billing & Shopping</h1>
              <p>Browse our products and add them to your cart</p>
            </div>
          </div>

          {/* Search, Filter, Sort, and Cart Controls */}
          <div className="controls-bar">
            <SearchBox
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search products..."
            />

            <FilterDropdown
              categories={categories}
              selectedCategories={selectedCategories}
              onToggleCategory={toggleCategory}
              onClearAll={() => setSelectedCategories([])}
              isOpen={showFilterDropdown}
              onToggleOpen={() => setShowFilterDropdown(!showFilterDropdown)}
            />

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

            <button className="cart-btn" onClick={() => navigate("/billing/cart")}>
              <FaShoppingCart />
              <span>Cart</span>
              {totalCartItems > 0 && (
                <span className="cart-badge">{totalCartItems}</span>
              )}
            </button>
          </div>

          {/* Products Count Display */}
          <div className="products-count">
            Showing {totalElements > 0 ? startIndex + 1 : 0}-{endIndex} of {totalElements} products
          </div>

          {/* Products Grid - Shows loading, empty, or product cards */}
          <div className="products-grid">
            {loading ? (
              <div className="loading-state">Loading products...</div>
            ) : filteredItems.length === 0 ? (
              <div className="empty-state">No products found</div>
            ) : (
              filteredItems.map(item => (
                <ProductCard
                  key={item.itemId}
                  item={item}
                  onAddToCart={addToCart}
                  isDisabled={cartItems.find(ci => ci.itemId === item.itemId)?.quantity >= item.quantity}
                />
              ))
            )}
          </div>

          {/* Arrow-based Pagination: < 1 > */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={goToPrevPage}
            onNext={goToNextPage}
          />
        </div>
      </div>
    </>
  );
};

export default BillingPage;
