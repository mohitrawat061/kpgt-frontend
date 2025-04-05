import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <p>&copy; 2025 KPGT Project</p>
        </div>
        <div className="footer-section links">
          <a href="#">About</a>
          <a href="#">Documentation</a>
          <a href="#">GitHub</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
