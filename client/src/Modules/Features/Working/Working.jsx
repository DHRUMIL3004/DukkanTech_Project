import "./Working.css";

function Working() {
  return (
    <div>
      <section className="how-it-works py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">How DukaanTech Works</h2>
            <p className="text-muted">
              Generate professional bills in just a few simple steps
            </p>
          </div>

          <div className="row g-4 text-center">
            {/* Step 1 */}
            <div className="col-md-3">
              <div className="card step-card p-4 h-100 shadow-sm">
                <div className="icon mb-3">📦</div>
                <h5>Add Products</h5>
                <p className="text-muted">
                  Add product name, price and quantity to create your shop
                  inventory.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="col-md-3">
              <div className="card step-card p-4 h-100 shadow-sm">
                <div className="icon mb-3">🛒</div>
                <h5>Select Items</h5>
                <p className="text-muted">
                  Choose products from the list when customers buy items.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="col-md-3">
              <div className="card step-card p-4 h-100 shadow-sm">
                <div className="icon mb-3">🧾</div>
                <h5>Generate Bill</h5>
                <p className="text-muted">
                  DukaanTech automatically calculates the total and creates the
                  bill.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="col-md-3">
              <div className="card step-card p-4 h-100 shadow-sm">
                <div className="icon mb-3">🖨</div>
                <h5>Print Invoice</h5>
                <p className="text-muted">
                  Print or download the invoice for customer and record keeping.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Working;
