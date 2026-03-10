import './Hero.css';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">Modern Billing Software for Retail Stores</h1>
          <p className="hero-subtitle">
            Eliminate manual billing and paperwork. Generate accurate bills, manage inventory,
            and track sales with our comprehensive retail management solution.
          </p>
          <div className="hero-buttons">
            <button className="hero-btn-primary"><a className='anchor' href='/login'>Explore More</a></button>
            <button className="hero-btn-secondary"><a className='anchor' href='/'>Features</a></button>
            
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;