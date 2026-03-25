import './Features.css'

import { Zap, BarChart3, TrendingUp, Users, Shield, ShoppingBag } from "lucide-react";

const featuresList = [
  {
    id: 1,
    icon: <Zap size={30} />,
    title: "Lightning Fast Billing",
    description:
      "Generate accurate bills in seconds with our intuitive interface."
  },
  {
    id: 2,
    icon: <BarChart3 size={30} />,
    title: "Inventory Management",
    description:
      "Track your products easily. Add, update, and organize items."
  },
  {
    id: 3,
    icon: <TrendingUp size={30} />,
    title: "Sales Analytics",
    description:
      "Monitor sales performance with reports and real-time tracking."
  },
  {
    id: 4,
    icon: <Users size={30} />,
    title: "Employee Management",
    description:
      "Register employees and control their access to the system."
  },
  {
    id: 5,
    icon: <Shield size={30} />,
    title: "Secure System",
    description:
      "Your business data is protected with secure access control."
  },
  {
    id: 6,
    icon: <ShoppingBag size={30} />,
    title: "Customer Records",
    description:
      "Maintain customer information and purchase history."
  }
];

function Features() {
  return (
    <section className="container py-5">

      <div className="text-center mb-5">
        <h2>Everything You Need to Run Your Store</h2>
        <p className="text-muted">
          Powerful features designed for retail businesses
        </p>
      </div>

      <div className="row">

        {featuresList.map((feature) => (
          <div className="col-md-4 mb-4" key={feature.id}>
            <div className="card h-100 text-center shadow-sm">

              <div className="card-body">

                <div className="mb-3 text-primary">
                  {feature.icon}
                </div>

                <h5 className="card-title">{feature.title}</h5>

                <p className="card-text text-muted">
                  {feature.description}
                </p>

              </div>

            </div>
          </div>
        ))}

      </div>

    </section>
  );
}

export default Features;