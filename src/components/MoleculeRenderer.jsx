import React, { useEffect, useRef, useState } from "react";
import SmilesDrawer from "smiles-drawer";

function MoleculeRenderer({ smiles }) {
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);

  // Directly measure molecule complexity
  const getMoleculeSize = (smiles) => {
    // Count distinct elements that indicate complexity
    const atomCount = (smiles.match(/[A-Z][a-z]?/g) || []).length;
    const branchCount = (smiles.match(/[\(\)]/g) || []).length;
    const ringCount = (smiles.match(/[0-9]/g) || []).length;
    const bondCount = (smiles.match(/[\-=#]/g) || []).length;

    // Base size calculation - more atoms and structural elements means larger canvas
    const baseSize = 300;
    const complexity =
      atomCount + branchCount / 2 + ringCount / 2 + bondCount / 2;

    // Scale formula based on testing with various molecules
    const scaleFactor = Math.min(Math.max(1, Math.sqrt(complexity) / 4), 3);

    const width = Math.round(baseSize * scaleFactor);
    const height = Math.round(baseSize * scaleFactor * 0.75); // 3:4 aspect ratio

    return { width, height };
  };

  useEffect(() => {
    // Reset error state
    setError(null);

    // Check for valid input
    if (!smiles) {
      setError("No SMILES string provided");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      setError("Canvas element not available");
      return;
    }

    // Calculate appropriate size based on molecule complexity
    const { width, height } = getMoleculeSize(smiles);

    // Update canvas dimensions
    canvas.width = width;
    canvas.height = height;

    try {
      // Create drawer with calculated dimensions
      const drawer = new SmilesDrawer.Drawer({
        width: width,
        height: height,
        bondThickness: 1.5,
        atomVisualization: "default",
        compactDrawing: false,
        explicitHydrogens: false,
        terminalCarbons: true,
        overlapSensitivity: 0.42,
        scale: 0.9, // Slightly smaller scale to ensure molecule fits
        padding: 20,
      });

      // Parse and draw
      SmilesDrawer.parse(
        smiles,
        function (tree) {
          try {
            drawer.draw(tree, canvas, "light", false);
          } catch (drawErr) {
            setError(`Error drawing molecule: ${drawErr.message}`);
            console.error("Drawing error:", drawErr);
          }
        },
        function (parseErr) {
          setError(`Failed to parse SMILES: ${parseErr.message}`);
          console.error("Parsing error:", parseErr);
        }
      );
    } catch (err) {
      setError(`Unexpected error with SmilesDrawer: ${err.message}`);
      console.error("General error:", err);
    }

    return () => {
      // Clean up if needed
    };
  }, [smiles]);

  return (
    <div className="molecule-renderer">
      <canvas
        ref={canvasRef}
        style={{
          border: "1px solid #ddd",
          backgroundColor: "#fff",
          display: "block",
          margin: "0 auto",
          maxWidth: "100%",
        }}
      />
      {error ? (
        <div
          className="molecule-error"
          style={{ color: "red", marginTop: "8px", textAlign: "center" }}
        >
          {error}
        </div>
      ) : (
        <div
          className="smiles-display"
          style={{
            marginTop: "12px",
            textAlign: "center",
            padding: "8px",
            background: "#f5f5f5",
            borderRadius: "4px",
            wordBreak: "break-all",
            fontFamily: "monospace",
          }}
        >
          <strong>SMILES:</strong> {smiles}
        </div>
      )}
    </div>
  );
}

export default MoleculeRenderer;
