import React, { useState } from "react";
import { makeApiRequest } from "../services/apiService";
import MoleculeRenderer from "./MoleculeRenderer";
import PropertyCard from "./PropertyCard";
import "./MoleculeComparison.css";

function MoleculeComparison() {
  const [molecules, setMolecules] = useState([
    { id: 1, smiles: "", name: "" },
    { id: 2, smiles: "", name: "" },
  ]);
  const [selectedProperties, setSelectedProperties] = useState([
    "esol",
    "lipo",
  ]);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleMoleculeChange = (id, field, value) => {
    setMolecules(
      molecules.map((mol) => (mol.id === id ? { ...mol, [field]: value } : mol))
    );
  };

  const handleAddMolecule = () => {
    const newId = Math.max(...molecules.map((m) => m.id)) + 1;
    setMolecules([...molecules, { id: newId, smiles: "", name: "" }]);
  };

  const handleRemoveMolecule = (id) => {
    if (molecules.length <= 2) {
      setError("You need at least two molecules for comparison");
      return;
    }
    setMolecules(molecules.filter((mol) => mol.id !== id));
    setResults((prev) => {
      const newResults = { ...prev };
      delete newResults[id];
      return newResults;
    });
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

  const handleCompare = async () => {
    setLoading(true);
    setError(null);

    // Validate inputs
    const invalidMolecules = molecules.filter((m) => !m.smiles);
    if (invalidMolecules.length > 0) {
      setError("All molecules must have SMILES strings");
      setLoading(false);
      return;
    }

    try {
      const newResults = {};

      // Make predictions for each molecule
      for (const molecule of molecules) {
        const requestData = {
          smiles: molecule.smiles,
          properties: selectedProperties,
        };

        const result = await makeApiRequest("/predict", requestData);
        newResults[molecule.id] = {
          ...result,
          // Use custom name if provided, otherwise use the one from API
          drug_name: molecule.name || result.drug_name,
        };
      }

      setResults(newResults);
    } catch (err) {
      setError("Error making predictions. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Determine if we have valid results to show
  const hasResults = Object.keys(results).length > 0;

  // Property details from your original component
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

  return (
    <div className="molecule-comparison">
      <h2>Compare Molecules</h2>
      <p>Enter SMILES strings for molecules you want to compare</p>

      <div className="molecules-input-section">
        {molecules.map((molecule) => (
          <div key={molecule.id} className="molecule-input-card">
            <div className="molecule-input-header">
              <h3>Molecule {molecule.id}</h3>
              {molecules.length > 2 && (
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveMolecule(molecule.id)}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="form-group">
              <label>Name (Optional)</label>
              <input
                type="text"
                value={molecule.name}
                onChange={(e) =>
                  handleMoleculeChange(molecule.id, "name", e.target.value)
                }
                placeholder="e.g., Aspirin"
              />
            </div>

            <div className="form-group">
              <label>SMILES String</label>
              <input
                type="text"
                value={molecule.smiles}
                onChange={(e) =>
                  handleMoleculeChange(molecule.id, "smiles", e.target.value)
                }
                placeholder="e.g., CCO"
                required
              />
            </div>

            {molecule.smiles && (
              <div className="molecule-preview">
                <MoleculeRenderer smiles={molecule.smiles} />
              </div>
            )}
          </div>
        ))}

        <button className="add-molecule-btn" onClick={handleAddMolecule}>
          + Add Another Molecule
        </button>
      </div>

      <div className="comparison-controls">
        <div className="form-group">
          <label htmlFor="compare-properties">Properties to Compare</label>
          <select
            id="compare-properties"
            multiple
            value={selectedProperties}
            onChange={handlePropertiesChange}
            required
          >
            <option value="esol">Water Solubility (ESOL)</option>
            <option value="tox21">Toxicity (Tox21)</option>
            <option value="lipo">Lipophilicity (Lipo)</option>
            <option value="binding_affinity">Binding Affinity</option>
            <option value="bioavailability">Bioavailability</option>
          </select>
        </div>

        <button
          className="compare-btn"
          onClick={handleCompare}
          disabled={loading}
        >
          {loading ? "Processing..." : "Compare Molecules"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {hasResults && (
        <div className="comparison-results">
          <h3>Comparison Results</h3>

          {selectedProperties.map((property) => (
            <div key={property} className="property-comparison-section">
              <h4>{propertyDetails[property].title || property}</h4>

              <div className="property-comparison-cards">
                {molecules.map((molecule) => {
                  const result = results[molecule.id];
                  if (
                    !result ||
                    !result.predictions ||
                    !result.predictions[property]
                  ) {
                    return null;
                  }

                  return (
                    <div key={molecule.id} className="molecule-result-card">
                      <h5>{result.drug_name}</h5>
                      <PropertyCard
                        property={property}
                        data={result.predictions[property]}
                        details={propertyDetails[property]}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MoleculeComparison;
