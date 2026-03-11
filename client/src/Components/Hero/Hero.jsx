import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero-section py-5 bg-primary text-white">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h1 className="display-5 fw-bold">DukaanTech Dashboard</h1>
            <p className="lead">
              Manage your store, users, categories and orders with a single control
              panel.
            </p>
            <a href="/manage-user" className="btn btn-light btn-lg mt-3">
              Get Started
            </a>
          </div>
          <div className="col-lg-6 text-center">
            <div className="hero-graphic shadow rounded p-4 bg-white">
              <div className="fs-1 text-primary">📦</div>
              <p className="mb-0">Everything you need to run your store.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
