import { useEffect, useState, useRef } from "react";
import { getOrders } from "../../Service/OrderHistory";
import Receipt from "../../Components/Billing/Receipt";
import "./OrderHistory.css";
import { getTotalRevenue } from "../../Service/BillingService";
import Footer from "../../Components/Footer/Footer";

const formatItems = (items) => items.map((i) => i.itemName).join(", ");
const formatDate  = (date)  => new Date(date).toLocaleDateString("en-GB");
const formatTime  = (date)  =>
  new Date(date).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

const SORT_OPTIONS = [
  { label: "Date (Newest)",        value: "createdAt|desc"    },
  { label: "Date (Oldest)",        value: "createdAt|asc"     },
  { label: "Name (A → Z)",         value: "customerName|asc"  },
  { label: "Name (Z → A)",         value: "customerName|desc" },
  { label: "Amount (High → Low)",  value: "totalAmount|desc"  },
  { label: "Amount (Low → High)",  value: "totalAmount|asc"   },
];

const TODAY    = new Date().toISOString().split("T")[0];
const nDaysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().split("T")[0]; };
const PRESETS  = [
  { label: "Today",        from: TODAY,        to: TODAY },
  { label: "Last 7 days",  from: nDaysAgo(7),  to: TODAY },
  { label: "Last 30 days", from: nDaysAgo(30), to: TODAY },
  { label: "Last 90 days", from: nDaysAgo(90), to: TODAY },
];

/* ═══════════════════════════════════════════════════════ */
const OrderHistory = () => {
  const [orders,        setOrders]        = useState([]);
  const [page,          setPage]          = useState(0);
  const [totalPages,    setTotalPages]    = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading,       setLoading]       = useState(false);

  const [search,      setSearch]      = useState("");
  const [fromDate,    setFromDate]    = useState("");
  const [toDate,      setToDate]      = useState("");
  const [sortCombo,   setSortCombo]   = useState("createdAt|desc");
  const [activePreset,setActivePreset]= useState(null);
  const [showDatePanel,setShowDatePanel]=useState(false);
  const datePanelRef = useRef(null);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showInvoice,   setShowInvoice]   = useState(false);

  const [sortBy, sortDir] = sortCombo.split("|");

  /* close date panel on outside click */
  useEffect(() => {
    const h = (e) => {
      if (datePanelRef.current && !datePanelRef.current.contains(e.target))
        setShowDatePanel(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* fetch */
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders(page, 10, search, fromDate, toDate, sortBy, sortDir);
      setOrders(data.data ?? []);
      setTotalPages(data.totalPages ?? 0);
      setPage(data.page ?? 0);
      setTotalElements(data.totalElements ?? data.data?.length ?? 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchOrders, 400);
    return () => clearTimeout(t);
  }, [page, search, fromDate, toDate, sortCombo]);

  const applyPreset = (p) => {
    setActivePreset(p.label); setFromDate(p.from); setToDate(p.to);
    setPage(0); setShowDatePanel(false);
  };
  const clearDates = () => { setFromDate(""); setToDate(""); setActivePreset(null); setPage(0); };
  const dateRangeLabel = () => {
    if (activePreset) return activePreset;
    if (fromDate && toDate) return `${fromDate} → ${toDate}`;
    if (fromDate) return `From ${fromDate}`;
    if (toDate)   return `Until ${toDate}`;
    return "Date Range";
  };

const [totalRevenue, setTotalRevenue] = useState(0);
useEffect(() => {

  const fetchRevenue=async()=>{
    try{
      const revenue = await getTotalRevenue();
      setTotalRevenue(revenue || 0);

    }catch(err){
      console.error("Error fetching total revenue:", err);
      setTotalRevenue(0);
  }
};
fetchRevenue();
}
, [orders]);
  
  const uniqueCustomers = new Set(orders.map(o => o.phone)).size;

  /* ─── render ─────────────────────────────────────────── */
  return (
    <div className="billing-page">
      <div className="billing-container">

        {/* HEADER */}
        <div className="oh-header">
          <div>
            <h1 className="oh-title">Order History</h1>
            <p className="oh-subtitle">
              {totalElements > 0
                ? `${totalElements} order${totalElements !== 1 ? "s" : ""} found`
                : "Browse all customer orders"}
            </p>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="oh-controls">

          {/* search */}
          <div className="oh-search-box">
            <svg className="oh-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search by name, phone or amount…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            />
            {search && (
              <button className="oh-clear-x" onClick={() => { setSearch(""); setPage(0); }}>✕</button>
            )}
          </div>

          {/* date range */}
          <div className="oh-date-wrapper" ref={datePanelRef}>
            <button
              className={`oh-date-btn${(fromDate || toDate) ? " active" : ""}`}
              onClick={() => setShowDatePanel(v => !v)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8"  y1="2" x2="8"  y2="6"/>
                <line x1="3"  y1="10" x2="21" y2="10"/>
              </svg>
              <span>{dateRangeLabel()}</span>
              {(fromDate || toDate) && (
                <span className="oh-date-clear" onClick={e => { e.stopPropagation(); clearDates(); }}>✕</span>
              )}
            </button>

            {showDatePanel && (
              <div className="oh-date-panel">
                <div className="oh-date-presets">
                  {PRESETS.map(p => (
                    <button
                      key={p.label}
                      className={`oh-preset-btn${activePreset === p.label ? " active" : ""}`}
                      onClick={() => applyPreset(p)}
                    >{p.label}</button>
                  ))}
                </div>
                <div className="oh-date-divider"/>
                <div className="oh-date-inputs">
                  <label>
                    <span>From</span>
                    <input type="date" value={fromDate} max={toDate || undefined}
                      onChange={e => { setFromDate(e.target.value); setActivePreset(null); setPage(0); }}/>
                  </label>
                  <label>
                    <span>To</span>
                    <input type="date" value={toDate} min={fromDate || undefined}
                      onChange={e => { setToDate(e.target.value); setActivePreset(null); setPage(0); }}/>
                  </label>
                </div>
                <button className="oh-apply-btn" onClick={() => setShowDatePanel(false)}>Apply</button>
              </div>
            )}
          </div>

          {/* sort */}
          <div className="oh-sort-wrapper">
            <svg className="oh-sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M7 12h10M10 18h4"/>
            </svg>
            <select
              className="oh-sort-select"
              value={sortCombo}
              onChange={e => { setSortCombo(e.target.value); setPage(0); }}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* STATS */}
        {!loading && orders.length > 0 && (
          <div className="oh-stats">
            <div className="oh-stat-card">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <div>
                <span className="oh-stat-val">{uniqueCustomers}</span>
                <span className="oh-stat-lbl">Customers</span>
              </div>
            </div>
            <div className="oh-stat-card">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
              <div>
                <span className="oh-stat-val">{orders.length}</span>
                <span className="oh-stat-lbl">Orders</span>
              </div>
            </div>
            <div className="oh-stat-card">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              <div>
                <span className="oh-stat-val">₹{totalRevenue.toFixed(2)}</span>
                <span className="oh-stat-lbl">Total Revenue</span>
              </div>
            </div>
            <div className="oh-stat-card">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              <div>
                <span className="oh-stat-val">
                  ₹{orders.length ? (totalRevenue / orders.length).toFixed(2) : "0.00"}
                </span>
                <span className="oh-stat-lbl">Avg Order</span>
              </div>
            </div>
          </div>
        )}

        {/* ── FLAT TABLE ── */}
        {loading ? (
          <div className="oh-loading"><div className="oh-spinner"/><p>Loading orders…</p></div>
        ) : orders.length === 0 ? (
          <div className="oh-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            <h3>No orders found</h3>
            <p>Try adjusting your search or date filters.</p>
          </div>
        ) : (
          <div className="oh-table-card">
            {/* thead */}
            <div className="oh-thead">
              <span className="col-no">#</span>
              <span className="col-customer">Customer</span>
              <span className="col-phone">Phone</span>
              <span className="col-items">Items</span>
              <span className="col-total">Total</span>
              <span className="col-payment">Payment</span>
              <span className="col-status">Status</span>
              <span className="col-date">Date &amp; Time</span>
              <span className="col-invoice">Invoice</span>
            </div>

            {/* rows */}
            {orders.map((order, i) => (
              <div className="oh-trow" key={order.orderId}>

                <span className="col-no oh-row-num">{page * 10 + i + 1}</span>

                {/* customer */}
                <span className="col-customer oh-cell-customer">
                  <span className="oh-mini-avatar">
                    {order.customerName?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                  <span className="oh-cell-name">{order.customerName}</span>
                </span>

                {/* phone */}
                <span className="col-phone oh-cell-phone">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  {order.phone}
                </span>

                {/* items */}
                <span className="col-items oh-row-items" title={formatItems(order.items)}>
                  {formatItems(order.items)}
                </span>

                {/* total */}
                <span className="col-total oh-row-amount">
                  ₹{parseFloat(order.totalAmount).toFixed(2)}
                </span>

                {/* payment */}
                <span className="col-payment">
                  <span className="oh-payment-badge">{order.paymentMethod}</span>
                </span>

                {/* status */}
                <span className="col-status">
                  <span className={`oh-status ${order.paid ? "success" : "fail"}`}>
                    {order.paid ? (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Success
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                        Failed
                      </>
                    )}
                  </span>
                </span>

                {/* date */}
                <span className="col-date oh-row-date">
                  <span className="oh-date-main">{formatDate(order.createdAt)}</span>
                  <span className="oh-date-time">{formatTime(order.createdAt)}</span>
                </span>

                {/* invoice */}
                <span className="col-invoice">
                  <button
                    className="oh-invoice-btn"
                    onClick={() => { setSelectedOrder(order); setShowInvoice(true); }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                    View
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {!loading && totalPages > 0 && (
          <div className="oh-pagination">
            <button className="oh-page-btn" disabled={page === 0} onClick={() => setPage(page - 1)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Prev
            </button>

            <div className="oh-page-numbers">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let p;
                if (totalPages <= 5)          p = i;
                else if (page < 3)            p = i;
                else if (page > totalPages-4) p = totalPages - 5 + i;
                else                          p = page - 2 + i;
                return (
                  <button
                    key={p}
                    className={`oh-page-num${p === page ? " active" : ""}`}
                    onClick={() => setPage(p)}
                  >{p + 1}</button>
                );
              })}
            </div>

            <button className="oh-page-btn" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
              Next
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        )}

      </div>

      {/* INVOICE MODAL */}
      {showInvoice && selectedOrder && (
        <div className="oh-modal-overlay" onClick={() => setShowInvoice(false)}>
          <div className="oh-modal" onClick={e => e.stopPropagation()}>
            <button className="oh-modal-close" onClick={() => setShowInvoice(false)}>✕</button>
            <Receipt
              billResponse={selectedOrder}
              onPrint={() => window.print()}
              onNewOrder={() => setShowInvoice(false)}
            />
          </div>
        </div>
      )}

      <Footer/>
    </div>
  );
};

export default OrderHistory;