import "./Working.css";

const Working = () => {
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="row align-items-center gy-4">
          <div className="col-md-6">
            <h2 className="fw-bold">How it works</h2>
            <p className="text-muted">
              Simple workflows powered by Bootstrap styling and a clean structure.
              Add items, manage categories, track orders and handle billing from one
              dashboard.
            </p>
            <div className="d-flex gap-3">
              <div className="step-pill">
                <span className="step-number">1</span>
                <span>Set up your users</span>
              </div>
              <div className="step-pill">
                <span className="step-number">2</span>
                <span>Manage inventory</span>
              </div>
              <div className="step-pill">
                <span className="step-number">3</span>
                <span>Track orders & reports</span>
              </div>
            </div>
          </div>
          <div className="col-md-6 text-center">
            <div className="working-graphic shadow-sm p-4 bg-white">
              <div className="fs-1 text-primary">⚙️</div>
              <p className="mb-0 text-muted">Fast setup, easy workflow.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Working;
