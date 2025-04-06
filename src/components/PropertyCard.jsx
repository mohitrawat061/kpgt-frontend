import React, { useState } from "react";
import "./PropertyCard.css";

function PropertyCard({ property, data, details }) {
  const [isFlipped, setIsFlipped] = useState(false);

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

  const getPropertyDescription = (property) => {
    switch (property) {
      case "esol":
        return "Water solubility (ESOL) measures how well a compound dissolves in water. Higher values indicate better solubility, which often correlates with improved bioavailability for oral medications. Poor solubility can limit drug effectiveness and absorption rate.";
      case "lipo":
        return "Lipophilicity (LogP) indicates how well a compound dissolves in fats versus water. Higher values mean greater fat solubility. This affects how drugs cross cell membranes, distribute in tissues, and may influence toxicity and metabolism.";
      case "tox21":
        return "Toxicity prediction based on the Tox21 dataset identifies potentially harmful compounds. Lower values indicate safer compounds. This helps screen out dangerous molecules early in development to avoid costly late-stage failures.";
      case "binding_affinity":
        return "Binding affinity measures how strongly a compound binds to its target protein. More negative values indicate stronger binding. Strong binding is often associated with greater potency and efficacy of a drug candidate.";
      case "bioavailability":
        return "Bioavailability refers to the proportion of a drug that enters circulation when introduced into the body. Higher values mean better absorption and utilization. This property is crucial for determining effective dosing and drug delivery methods.";
      default:
        return "Detailed information about this property is not available.";
    }
  };

  const valueStyle = getValueRangeStyle(property, data.value);
  const confidencePercent = data.confidence;
  const propertyDescription = getPropertyDescription(property);

  // Calculate width for gauge visualization, ensuring it's between 0-100%
  const gaugeWidth = Math.max(0, Math.min(100, Math.abs(data.value * 20))); // Adjust multiplier as needed

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className={`property-card-container ${isFlipped ? "flipped" : ""}`}
      onClick={handleClick}
    >
      <div className="property-card-inner">
        {/* Front face of the card */}
        <div className="property-card-front">
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

          <div className="flip-prompt">
            <small>Click for more details</small>
          </div>
        </div>

        {/* Back face of the card */}
        <div
          className="property-card-back"
          style={{ borderTop: `4px solid ${valueStyle.color}` }}
        >
          <h3>{details.title || property}</h3>

          <div className="property-details">
            <h4>What is this?</h4>
            <p>{propertyDescription}</p>

            <h4>Interpretation</h4>
            <p>
              Value:{" "}
              <strong>
                {data.value} {details.unit}
              </strong>{" "}
              - {valueStyle.label}
            </p>
            <p>{data.explanation}</p>

            <h4>Confidence Level</h4>
            <div className="confidence-meter">
              <div
                className="confidence-fill"
                style={{
                  width: `${confidencePercent}%`,
                  backgroundColor:
                    confidencePercent > 80
                      ? "#4CAF50"
                      : confidencePercent > 60
                      ? "#FFC107"
                      : "#F44336",
                }}
              ></div>
            </div>
            <p className="confidence-text">
              {confidencePercent < 50
                ? "Low confidence: consider additional validation"
                : confidencePercent < 75
                ? "Moderate confidence: acceptable for initial screening"
                : "High confidence: reliable prediction"}
            </p>
          </div>

          <div className="flip-prompt">
            <small>Click to return</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;
