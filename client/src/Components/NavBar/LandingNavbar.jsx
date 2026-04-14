import "./LandingNavbar.css";

function LandingNavbar() {
  return (
    <nav className="landing-navbar navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center" href="/">
          <img className="logo me-2" src="/Logo.png" alt="logo" />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item ms-3">
              <a className="btn btn-primary px-4 rounded-pill" href="/login">
                Get Started
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default LandingNavbar;
