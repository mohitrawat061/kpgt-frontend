import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="page-container home-container">
      <div className="hero-section">
        <h1>Welcome to KPGT ML Project</h1>
        <p className="subtitle">
          A powerful machine learning application for predictive analytics
        </p>
        <div className="cta-buttons">
          <Link to="/prediction" className="cta-button primary">
            Make Predictions
          </Link>
          <Link to="/dashboard" className="cta-button secondary">
            View Dashboard
          </Link>
        </div>
      </div>

      <div className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔮</div>
            <h3>Predictive Analysis</h3>
            <p>
              Use our advanced ML model to make accurate predictions based on
              your data.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Interactive Dashboard</h3>
            <p>
              Visualize model performance and prediction results with our
              interactive dashboard.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📁</div>
            <h3>Batch Processing</h3>
            <p>
              Upload CSV or Excel files to process multiple predictions at once.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>Model Insights</h3>
            <p>
              Understand the factors that influence predictions with detailed
              model explanations.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔮</div>
            <h3>NOOB</h3>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quisquam
              soluta aliquid.
            </p>
          </div>
        </div>
      </div>

      <div className="getting-started-section">
        <h2>Getting Started</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Input Your Data</h3>
              <p>Enter feature values through our user-friendly interface.</p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Run the Model</h3>
              <p>Process your data through our trained ML model.</p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Analyze Results</h3>
              <p>
                View and interpret prediction results with confidence scores.
              </p>
            </div>
          </div>
        </div>

        <Link to="/prediction" className="start-now-button">
          Start Now
        </Link>
      </div>
    </div>
  );
}

export default Home;
