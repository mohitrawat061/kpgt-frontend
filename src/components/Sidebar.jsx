import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ onToggle }) {
  // Start with sidebar closed by default
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize to detect mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    // If parent component needs to know sidebar state
    if (onToggle) {
      onToggle(newIsOpen);
    }
  };

  return (
    <>
      <div className="hamburger-menu visible" onClick={toggleSidebar}>
        <div className={`hamburger-icon ${isOpen ? "open" : ""}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h3>KPGT</h3>
          <p>ML Project Dashboard</p>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={() => isMobile && setIsOpen(false)}
              >
                <i className="icon">🏠</i>
                <span className="nav-text">Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/prediction"
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={() => isMobile && setIsOpen(false)}
              >
                <i className="icon">🔮</i>
                <span className="nav-text">Make Predictions</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={() => isMobile && setIsOpen(false)}
              >
                <i className="icon">📊</i>
                <span className="nav-text">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/model-details"
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={() => isMobile && setIsOpen(false)}
              >
                <i className="icon">🧠</i>
                <span className="nav-text">Model Details</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <p>© 2025 KPGT Project</p>
        </div>
      </div>

      {isOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
    </>
  );
}

export default Sidebar;
