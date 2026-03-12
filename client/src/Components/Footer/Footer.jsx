import { ShoppingBag } from 'lucide-react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section footer-section-brand">
            <div className="footer-brand">
              <ShoppingBag className="footer-icon" />
              <span className="footer-title">DukaanTech</span>
            </div>
            <p className="footer-description">
              Modern retail billing software designed to help shop owners streamline
              operations, reduce errors, and grow their business.
            </p>
          </div>

         
        </div>

        <div className="footer-bottom">
          <p>2026 DukaanTech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
