import React, { useState } from "react";
import { makeApiRequest } from "../services/apiService";
import MoleculeRenderer from "../components/MoleculeRenderer";
import { jsPDF } from "jspdf";
import "./Prediction.css";
import PropertyCard from "../components/PropertyCard";

const propertyDetails = {
  esol: {
    title: "💧 Water Solubility (ESOL)",
    unit: "logS",
    reference: "Highly soluble: >0, Poorly soluble: < -2",
  },
  tox21: {
    title: "☠️ Toxicity (Tox21)",
    unit: "",
    reference: "",
  },
  lipo: {
    title: "🔥 Lipophilicity (Lipo)",
    unit: "logP",
    reference: "",
  },
  binding_affinity: {
    title: "🔗 Binding Affinity",
    unit: "",
    reference: "",
  },
  bioavailability: {
    title: "🚀 Bioavailability",
    unit: "",
    reference: "",
  },
};

function Prediction() {
  const [smiles, setSmiles] = useState("");
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSmilesChange = (e) => {
    setSmiles(e.target.value);
  };

  const handlePropertiesChange = (e) => {
    const options = e.target.options;
    const values = [];
    for (let i = 0, len = options.length; i < len; i++) {
      if (options[i].selected) {
        values.push(options[i].value);
      }
    }
    setSelectedProperties(values);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);
    try {
      const requestData = { smiles, properties: selectedProperties };
      const result = await makeApiRequest("/predict", requestData);
      setPrediction(result);
      // Save prediction to local history
      const history = JSON.parse(
        localStorage.getItem("predictionHistory") || "[]"
      );
      history.push({ smiles, result, date: new Date() });
      localStorage.setItem("predictionHistory", JSON.stringify(history));
    } catch (err) {
      setError("Error making prediction. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!prediction) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Prediction Report for ${prediction.drug_name}`, 10, 20);
    doc.setFontSize(12);
    doc.text(`SMILES: ${smiles}`, 10, 30);
    let yPos = 40;
    selectedProperties.forEach((prop) => {
      const resultData = prediction.predictions[prop];
      if (resultData) {
        const details = propertyDetails[prop] || {};
        doc.text(`${details.title || prop}`, 10, yPos);
        yPos += 7;
        doc.text(`Value: ${resultData.value} ${details.unit}`, 10, yPos);
        yPos += 7;
        doc.text(`Confidence: ${resultData.confidence}%`, 10, yPos);
        yPos += 7;
        doc.text(`Explanation: ${resultData.explanation}`, 10, yPos);
        yPos += 10;
      }
    });
    doc.save(`Prediction_Report_${Date.now()}.pdf`);
  };

  return (
    <div className="page-container prediction-container">
      <h1>Make a Prediction</h1>
      <p>
        Enter a SMILES string and select the properties you want to predict.
      </p>

      <form onSubmit={handleSubmit} className="prediction-form">
        <div className="form-group">
          <label htmlFor="smiles">SMILES String</label>
          <input
            type="text"
            id="smiles"
            value={smiles}
            onChange={handleSmilesChange}
            placeholder="e.g., CCO"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="properties">Select Properties</label>
          <select
            id="properties"
            multiple
            value={selectedProperties}
            onChange={handlePropertiesChange}
            required
          >
            <option value="esol">Water Solubility (ESOL)</option>
            <option value="tox21">Toxicity (Tox21)</option>
            <option value="lipo">Lipophilicity (Lipo)</option>
            <option value="lipo">Lipophilicity (Lipo)</option>
            <option value="binding_affinity">Binding Affinity</option>
            <option value="bioavailability">Bioavailability</option>
          </select>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Processing..." : "Get Prediction"}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {prediction && (
        <div className="prediction-results">
          <h2>Prediction Results for {prediction.drug_name}</h2>
          <div className="results-grid">
            {selectedProperties.map((prop) => {
              const resultData = prediction.predictions[prop];
              if (!resultData) return null;
              const details = propertyDetails[prop] || {};
              return (
                <PropertyCard
                  key={prop}
                  property={prop}
                  data={resultData}
                  details={details}
                />
              );
            })}
          </div>
          <button className="download-btn" onClick={handleDownloadReport}>
            Download Report
          </button>
        </div>
      )}

      {smiles && (
        <div className="molecule-section">
          <h2>Molecular Structure</h2>
          <MoleculeRenderer smiles={smiles} />
        </div>
      )}

      <div className="history-section">
        <h2>Prediction History</h2>
        <History />
      </div>
    </div>
  );
}

function History() {
  const history = JSON.parse(localStorage.getItem("predictionHistory") || "[]");
  if (history.length === 0) {
    return <p>No history available.</p>;
  }
  return (
    <ul className="history-list">
      {history
        .slice()
        .reverse()
        .map((item, index) => (
          <li key={index}>
            <span>{new Date(item.date).toLocaleString()}</span> - SMILES:{" "}
            {item.smiles}
          </li>
        ))}
    </ul>
  );
}

export default Prediction;
