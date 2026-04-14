import "./Hero.css";

function Hero() {
  const scrollToFeatures = () => {
    const section = document.getElementById("features");
    if (section) {
      const navbarOffset = 80; // adjust if your navbar is taller/shorter
      const elementPosition =
        section.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Modern Billing Software for Retail Stores
          </h1>
          <p className="hero-subtitle">
            Eliminate manual billing and paperwork. Generate accurate bills,
            manage inventory, and track sales with our comprehensive retail
            management solution.
          </p>
          <div className="hero-buttons">
            <button className="hero-btn-primary">
              <a className="anchor" href="/login">
                Explore More
              </a>
            </button>
            <button className="hero-btn-secondary" onClick={scrollToFeatures}>
              <a className="anchor" href="#features">
                Features
              </a>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
