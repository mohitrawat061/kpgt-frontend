import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Prediction from "./pages/Prediction";
import Dashboard from "./pages/Dashboard";
import ModelDetails from "./pages/ModelDetails";
import "./App.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <div className="app">
        <Header toggleSidebar={toggleSidebar} />
        <div className="main-container">
          {sidebarOpen && <Sidebar />}
          <div className={`content ${!sidebarOpen ? "full-width" : ""}`}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/prediction" element={<Prediction />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/model-details" element={<ModelDetails />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
