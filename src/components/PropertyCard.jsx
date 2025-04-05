import React from "react";
import "./PropertyCard.css"; // We'll create this stylesheet next

function PropertyCard({ property, data, details }) {
  // Determine value range for visualization
  const getValueRangeStyle = (property, value) => {
    // Custom logic per property type
    switch (property) {
      case "esol":
        // Water solubility ranges
        if (value > 0) return { color: "#4CAF50", label: "Highly soluble" };
        if (value > -2)
          return { color: "#FFC107", label: "Moderately soluble" };
        return { color: "#F44336", label: "Poorly soluble" };

      case "lipo":
        // Lipophilicity ranges
        if (value < 2) return { color: "#4CAF50", label: "Low" };
        if (value < 5) return { color: "#FFC107", label: "Moderate" };
        return { color: "#F44336", label: "High" };

      case "tox21":
        // Toxicity interpretation (assuming 0-1 scale where higher is more toxic)
        if (value < 0.3) return { color: "#4CAF50", label: "Low toxicity" };
        if (value < 0.7)
          return { color: "#FFC107", label: "Moderate toxicity" };
        return { color: "#F44336", label: "High toxicity" };

      case "binding_affinity":
        // Binding affinity (assuming negative values like -8.5 are stronger)
        if (value < -9) return { color: "#4CAF50", label: "Strong binding" };
        if (value < -7) return { color: "#FFC107", label: "Moderate binding" };
        return { color: "#F44336", label: "Weak binding" };

      case "bioavailability":
        // Bioavailability (0-1 scale)
        if (value > 0.7) return { color: "#4CAF50", label: "High" };
        if (value > 0.3) return { color: "#FFC107", label: "Moderate" };
        return { color: "#F44336", label: "Low" };

      default:
        return { color: "#2196F3", label: "N/A" };
    }
  };

  const valueStyle = getValueRangeStyle(property, data.value);
  const confidencePercent = data.confidence;

  // Calculate width for gauge visualization, ensuring it's between 0-100%
  const gaugeWidth = Math.max(0, Math.min(100, Math.abs(data.value * 20))); // Adjust multiplier as needed

  return (
    <div className="property-card">
      <div className="card-header">
        <h3>{details.title || property}</h3>
        <span
          className="confidence-badge"
          style={{
            backgroundColor:
              confidencePercent > 80
                ? "#4CAF50"
                : confidencePercent > 60
                ? "#FFC107"
                : "#F44336",
          }}
        >
          {confidencePercent}% confidence
        </span>
      </div>

      <div className="property-value">
        <span className="value-number" style={{ color: valueStyle.color }}>
          {data.value} {details.unit}
        </span>
        <span className="value-label">{valueStyle.label}</span>
      </div>

      <div className="property-gauge-container">
        <div className="property-gauge-track">
          <div
            className="property-gauge-fill"
            style={{
              width: `${gaugeWidth}%`,
              backgroundColor: valueStyle.color,
            }}
          ></div>
        </div>
      </div>

      <div className="property-explanation">
        <p>{data.explanation}</p>
      </div>

      {details.reference && (
        <div className="reference-range">
          <small>Reference: {details.reference}</small>
        </div>
      )}
    </div>
  );
}

export default PropertyCard;
