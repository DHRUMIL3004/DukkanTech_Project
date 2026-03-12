import "./About.css";

const About = () => {
  return (
    <section className="py-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-5">
            <div className="about-card card shadow-sm p-4">
              <h3>Why DukaanTech?</h3>
              <p className="text-muted">
                DukaanTech brings your entire store ecosystem into one friendly
                interface. From user management to billing, everything works
                together.
              </p>
              <ul className="list-unstyled text-muted">
                <li>✅ Role-based user access</li>
                <li>✅ Inventory & category tracking</li>
                <li>✅ Easy order & billing tracking</li>
              </ul>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="about-graphic shadow-sm p-4 text-center bg-white">
              <div className="fs-1 text-primary">💡</div>
              <p className="mb-0">Built for simplicity, designed for growth.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
