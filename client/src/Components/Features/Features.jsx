import "./Features.css";

const Features = () => {
  const cards = [
    {
      title: "User management",
      description: "Create, edit and delete team members in seconds.",
      icon: "bi-people-fill",
    },
    {
      title: "Inventory control",
      description: "Track products, categories and stock levels from one place.",
      icon: "bi-box-seam",
    },
    {
      title: "Orders & billing",
      description: "Review orders, generate invoices and track payments.",
      icon: "bi-receipt",
    },
  ];

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="mb-4 text-center">Key features</h2>
        <div className="row g-4">
          {cards.map((card) => (
            <div key={card.title} className="col-md-4">
              <div className="feature-card card h-100 shadow-sm">
                <div className="card-body text-center">
                  <div className="feature-icon mb-3">
                    <i className={`bi ${card.icon} fs-1 text-primary`} />
                  </div>
                  <h5 className="card-title">{card.title}</h5>
                  <p className="card-text text-muted">{card.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
