import { useEffect, useState } from "react";
import NavBar from "./NavBar/NavBar";
import { getOrders } from "../Service/OrderHistory";
import { getItems } from "../Service/ItemService";
import { getCategories } from "../Service/CategoryService";
import { getUsers } from "../Service/UserService";
import "./AdminDashboard.css";

// ─── Helpers ───────────────────────────────────────────────────────────────
const formatDate = (d) => new Date(d).toLocaleDateString("en-GB");
const formatCurrency = (n) =>
  "₹ " + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 });

const isToday = (dateStr) => {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
};

// ─── Stat Card ─────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, accent }) {
  return (
    <div className={`dash-stat-card dash-stat-card--${accent}`}>
      <div className="dash-stat-icon">{icon}</div>
      <div className="dash-stat-body">
        <p className="dash-stat-label">{label}</p>
        <p className="dash-stat-value">{value}</p>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ordersRes, itemsRes, catsRes, usersRes] = await Promise.all([
          getOrders(0, 100),
          getItems(0, 100),
          getCategories(),
          getUsers(),
        ]);
        setOrders(ordersRes?.data || []);
        setItems(itemsRes?.data || []);
        setCategories(catsRes?.data || []);
        setUsers(usersRes?.data || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ── Derived stats ──────────────────────────────────────────────────────
  const totalRevenue = orders
    .filter((o) => o.paid)
    .reduce((s, o) => s + Number(o.totalAmount || 0), 0);

  const totalCustomers = new Set(orders.map((o) => o.phone)).size;
  const totalOrdersCount = orders.length;

  const todayOrders = orders.filter((o) => isToday(o.createdAt));
  const todaySuccess = todayOrders.filter((o) => o.paid).length;
  const todayFailed = todayOrders.filter((o) => !o.paid).length;

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Revenue by category (match item's category field to category name)
  const categoryRevenue = categories.map((cat) => {
    const catItems = items.filter(
      (item) =>
        item.categoryId === cat.id || item.categoryName === cat.name
    );
    const catItemNames = new Set(catItems.map((i) => i.name));
    const revenue = orders
      .filter((o) => o.paid)
      .flatMap((o) => o.items || [])
      .filter((i) => catItemNames.has(i.itemName))
      .reduce((s, i) => s + Number(i.total || 0), 0);
    return { name: cat.name, revenue };
  });
  const maxCatRevenue = Math.max(...categoryRevenue.map((c) => c.revenue), 1);

  // Low stock threshold
  const LOW_STOCK = 10;
  const lowStockItems = items
    .filter((i) => Number(i.quantity) <= LOW_STOCK)
    .sort((a, b) => a.quantity - b.quantity);

  // Payment method split
  const cashCount = orders.filter(
    (o) => o.paymentMethod?.toLowerCase() === "cash"
  ).length;
  const upiCount = orders.filter(
    (o) => o.paymentMethod?.toLowerCase() === "upi"
  ).length;
  const otherCount = orders.length - cashCount - upiCount;
  const payTotal = orders.length || 1;

  const COLORS = [
    "#4f7cff", "#22c497", "#f5a623", "#e05c5c",
    "#9b7fe8", "#3ecfcf", "#f97316", "#84cc16",
  ];

  if (loading) {
    return (
      <div className="dash-loading">
        <div className="dash-spinner" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dash-root">
      <NavBar />

      <main className="dash-main">
        {/* ── Page Header ─────────────────────────────────────────── */}
        <div className="dash-header">
          <div>
            <h1 className="dash-title">Dashboard</h1>
            <p className="dash-subtitle">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* ── OVERVIEW ROW 1 – 4 cards ────────────────────────────── */}
        <section className="dash-section">
          <h2 className="dash-section-title">Overview</h2>
          <div className="dash-grid dash-grid--4">
            <StatCard
              icon="₹"
              label="Total Revenue"
              value={formatCurrency(totalRevenue)}
              accent="green"
            />
            <StatCard
              icon="📦"
              label="Total Products"
              value={items.length}
              accent="blue"
            />
            <StatCard
              icon="🧾"
              label="Total Orders"
              value={totalOrdersCount}
              accent="purple"
            />
            <StatCard
              icon="👥"
              label="Total Customers"
              value={totalCustomers}
              accent="amber"
            />
          </div>
        </section>

        {/* ── OVERVIEW ROW 2 – 3 cards ────────────────────────────── */}
        <div className="dash-grid dash-grid--3">
          <StatCard
            icon="🗓️"
            label="Total Orders Today"
            value={todayOrders.length}
            accent="blue"
          />
          <StatCard
            icon="✅"
            label="Success Payments"
            value={todaySuccess}
            accent="green"
          />
          <StatCard
            icon="❌"
            label="Failed Payments"
            value={todayFailed}
            accent="red"
          />
        </div>

        {/* ── RECENT ORDERS ────────────────────────────────────────── */}
        <section className="dash-section">
          <div className="dash-section-head">
            <h2 className="dash-section-title">Recent Orders</h2>
            <span className="dash-badge">Last 5 orders</span>
          </div>
          <div className="dash-card">
            {recentOrders.length === 0 ? (
              <p className="dash-empty">No orders found.</p>
            ) : (
              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Customer</th>
                      <th>Phone</th>
                      <th>Items</th>
                      <th>Amount</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, i) => (
                      <tr key={order.orderId}>
                        <td className="dash-td-muted">{i + 1}</td>
                        <td className="dash-td-bold">{order.customerName}</td>
                        <td className="dash-td-muted">{order.phone}</td>
                        <td>
                          {(order.items || [])
                            .map((it) => it.itemName)
                            .join(", ") || "—"}
                        </td>
                        <td className="dash-td-bold">
                          {formatCurrency(order.totalAmount)}
                        </td>
                        <td>
                          <span
                            className={`dash-pill dash-pill--${
                              order.paymentMethod?.toLowerCase() === "upi"
                                ? "upi"
                                : "cash"
                            }`}
                          >
                            {order.paymentMethod || "—"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`dash-pill ${
                              order.paid
                                ? "dash-pill--success"
                                : "dash-pill--fail"
                            }`}
                          >
                            {order.paid ? "Paid" : "Failed"}
                          </span>
                        </td>
                        <td className="dash-td-muted">
                          {formatDate(order.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* ── SALES BY CATEGORY ────────────────────────────────────── */}
        <section className="dash-section">
          <h2 className="dash-section-title">Sales by Category</h2>
          <div className="dash-card">
            {categoryRevenue.length === 0 ? (
              <p className="dash-empty">No category data.</p>
            ) : (
              <div className="dash-cat-list">
                {categoryRevenue.map((cat, i) => (
                  <div className="dash-cat-row" key={cat.name}>
                    <span className="dash-cat-name">{cat.name}</span>
                    <div className="dash-cat-track">
                      <div
                        className="dash-cat-fill"
                        style={{
                          width: `${(cat.revenue / maxCatRevenue) * 100}%`,
                          background: COLORS[i % COLORS.length],
                        }}
                      />
                    </div>
                    <span className="dash-cat-val">
                      {formatCurrency(cat.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── LOW STOCK ITEMS ──────────────────────────────────────── */}
        <section className="dash-section">
          <div className="dash-section-head">
            <h2 className="dash-section-title">Low Stock Items</h2>
            {lowStockItems.length > 0 && (
              <span className="dash-badge dash-badge--warn">
                ⚠ {lowStockItems.length} item{lowStockItems.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <div className="dash-card">
            {lowStockItems.length === 0 ? (
              <p className="dash-empty">✅ All items are well stocked.</p>
            ) : (
              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Item Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockItems.map((item, i) => (
                      <tr key={item.id}>
                        <td className="dash-td-muted">{i + 1}</td>
                        <td className="dash-td-bold">{item.name}</td>
                        <td className="dash-td-muted">
                          {item.categoryName || "—"}
                        </td>
                        <td>{formatCurrency(item.price || 0)}</td>
                        <td
                          className={
                            item.quantity <= 3
                              ? "dash-td-red"
                              : "dash-td-amber"
                          }
                        >
                          {item.quantity}
                        </td>
                        <td>
                          <span
                            className={`dash-pill ${
                              item.quantity <= 3
                                ? "dash-pill--fail"
                                : "dash-pill--warn"
                            }`}
                          >
                            {item.quantity <= 3 ? "Critical" : "Low"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* ── PAYMENT METHOD SPLIT ─────────────────────────────────── */}
        <section className="dash-section">
          <h2 className="dash-section-title">
            Payment Method Split &amp; Quick Stats
          </h2>
          <div className="dash-grid dash-grid--2">
            {/* Cash */}
            <div className="dash-card dash-pay-card">
              <p className="dash-pay-method">Cash</p>
              <p className="dash-pay-count">{cashCount}</p>
              <div className="dash-pay-bar-track">
                <div
                  className="dash-pay-bar-fill dash-pay-bar-fill--cash"
                  style={{ width: `${(cashCount / payTotal) * 100}%` }}
                />
              </div>
              <p className="dash-pay-pct">
                {Math.round((cashCount / payTotal) * 100)}% of orders
              </p>
            </div>

            {/* UPI */}
            <div className="dash-card dash-pay-card">
              <p className="dash-pay-method">UPI</p>
              <p className="dash-pay-count">{upiCount}</p>
              <div className="dash-pay-bar-track">
                <div
                  className="dash-pay-bar-fill dash-pay-bar-fill--upi"
                  style={{ width: `${(upiCount / payTotal) * 100}%` }}
                />
              </div>
              <p className="dash-pay-pct">
                {Math.round((upiCount / payTotal) * 100)}% of orders
              </p>
            </div>
          </div>

          {/* Quick stats row */}
          <div className="dash-quick-row">
            <div className="dash-quick-item">
              <span className="dash-quick-label">Total Categories</span>
              <span className="dash-quick-val">{categories.length}</span>
            </div>
            <div className="dash-quick-divider" />
            <div className="dash-quick-item">
              <span className="dash-quick-label">Total Products</span>
              <span className="dash-quick-val">{items.length}</span>
            </div>
            <div className="dash-quick-divider" />
            <div className="dash-quick-item">
              <span className="dash-quick-label">Total Users</span>
              <span className="dash-quick-val">{users.length}</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
