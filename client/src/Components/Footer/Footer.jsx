import { ShoppingBag } from "lucide-react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-col footer-brand-section">
            <div className="footer-brand">
              <ShoppingBag className="footer-icon" />
              <span className="footer-title">DukaanTech</span>
            </div>

            <p className="footer-description">
              Modern retail billing software designed to help shop owners
              streamline operations, reduce errors, and grow their business.
            </p>
          </div>

          {/* Contact */}
          <div className="footer-col footer-contact-box">
            <h4 className="footer-heading">Contact Us</h4>

            <div className="footer-contact">
              <p className="footer-email">
                Email :
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=support@dukaantech.com"
                  target="_blank"
                >
                  &nbsp; support@dukaantech.com
                </a>
              </p>
              <p>Phone : +91 9876543210</p>
              <p>Location : Gujarat, India</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p>© 2026 DukaanTech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
