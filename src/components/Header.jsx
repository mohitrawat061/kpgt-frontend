import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header({ toggleSidebar }) {
  return (
    <header>
      <div className="header-left">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          ☰
        </button>
        <div className="logo">
          <Link to="/">KPGT</Link>
        </div>
      </div>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/prediction">Make Predictions</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/model-details">Model Details</Link>
      </nav>
    </header>
  );
}

export default Header;
