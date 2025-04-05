import React, { useState, useEffect } from "react";
import { fetchModelDetails } from "../services/apiService";
import "./ModelDetails.css"; // This will match the CSS file we're creating

function ModelDetails() {
  const [modelData, setModelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadModelDetails = async () => {
      try {
        const data = await fetchModelDetails();
        setModelData(data);
      } catch (err) {
        setError("Failed to load model details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadModelDetails();
  }, []);

  if (loading) return <div className="loading">Loading model details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!modelData) return <div className="no-data">No model data available</div>;

  return (
    <div className="page-container model-details-container">
      <h1>Model Details</h1>

      <div className="model-card">
        <div className="model-header">
          <h2>{modelData.name}</h2>
          <span className="model-version">Version {modelData.version}</span>
        </div>

        <div className="model-info">
          <div className="info-item">
            <label>Model Type:</label>
            <span>{modelData.type}</span>
          </div>

          <div className="info-item">
            <label>Created Date:</label>
            <span>{modelData.created_date}</span>
          </div>

          <div className="info-item">
            <label>Training Data Size:</label>
            <span>{modelData.training_data_size.toLocaleString()} samples</span>
          </div>
        </div>

        <div className="metrics-section">
          <h3>Performance Metrics</h3>
          <div className="metrics-grid">
            <div className="metric-box">
              <div className="metric-value">
                {modelData.accuracy.toFixed(1)}%
              </div>
              <div className="metric-label">Accuracy</div>
            </div>
            <div className="metric-box">
              <div className="metric-value">
                {modelData.precision.toFixed(1)}%
              </div>
              <div className="metric-label">Precision</div>
            </div>
            <div className="metric-box">
              <div className="metric-value">{modelData.recall.toFixed(1)}%</div>
              <div className="metric-label">Recall</div>
            </div>
            <div className="metric-box">
              <div className="metric-value">
                {modelData.f1_score.toFixed(1)}%
              </div>
              <div className="metric-label">F1 Score</div>
            </div>
          </div>
        </div>

        <div className="features-section">
          <h3>Features</h3>
          <table className="features-table">
            <thead>
              <tr>
                <th>Feature Name</th>
                <th>Importance</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {modelData.features.map((feature, index) => (
                <tr key={index}>
                  <td>{feature.name}</td>
                  <td>
                    <div className="importance-bar-container">
                      <div
                        className="importance-bar"
                        style={{ width: `${feature.importance * 100}%` }}
                      />
                      <span>{(feature.importance * 100).toFixed(1)}%</span>
                    </div>
                  </td>
                  <td>{feature.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ModelDetails;
