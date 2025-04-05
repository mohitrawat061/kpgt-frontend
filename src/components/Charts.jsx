import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function PropertyCharts({ prediction, selectedProperties }) {
  const barChartRef = useRef(null);
  const radarChartRef = useRef(null);
  const barChartInstance = useRef(null);
  const radarChartInstance = useRef(null);

  useEffect(() => {
    if (!prediction || !selectedProperties || selectedProperties.length === 0)
      return;

    // Clean up previous chart instances
    if (barChartInstance.current) {
      barChartInstance.current.destroy();
    }
    if (radarChartInstance.current) {
      radarChartInstance.current.destroy();
    }

    // Prepare data for the charts
    const labels = [];
    const values = [];
    const backgroundColors = [];
    const propertyData = selectedProperties
      .map((prop) => {
        const resultData = prediction.predictions[prop];
        if (!resultData) return null;

        // Get color based on value
        let color;
        if (prop === "esol") {
          color =
            resultData.value > 0
              ? "rgba(76, 175, 80, 0.6)"
              : resultData.value > -2
              ? "rgba(255, 193, 7, 0.6)"
              : "rgba(244, 67, 54, 0.6)";
        } else if (prop === "tox21") {
          color =
            resultData.value < 0.3
              ? "rgba(76, 175, 80, 0.6)"
              : resultData.value < 0.7
              ? "rgba(255, 193, 7, 0.6)"
              : "rgba(244, 67, 54, 0.6)";
        } else {
          color = "rgba(33, 150, 243, 0.6)";
        }

        labels.push(prop);
        values.push(resultData.value);
        backgroundColors.push(color);

        return {
          property: prop,
          value: resultData.value,
          color,
        };
      })
      .filter(Boolean);

    // Create Bar Chart
    if (barChartRef.current) {
      const barCtx = barChartRef.current.getContext("2d");
      barChartInstance.current = new Chart(barCtx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Property Values",
              data: values,
              backgroundColor: backgroundColors,
              borderColor: backgroundColors.map((color) =>
                color.replace("0.6", "1")
              ),
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: `${prediction.drug_name} Properties`,
              font: {
                size: 16,
              },
            },
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `Value: ${context.raw}`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: false,
            },
          },
        },
      });
    }

    // Create Radar Chart for multi-property analysis
    if (radarChartRef.current && propertyData.length >= 3) {
      // Normalize values to 0-1 scale for radar chart
      const normalizedValues = propertyData.map((item) => {
        // Simple normalization logic - can be improved based on property ranges
        let normalizedValue;

        switch (item.property) {
          case "esol":
            // Water solubility (-10 to 2 range to 0-1)
            normalizedValue = (item.value + 10) / 12;
            break;
          case "lipo":
            // Lipophilicity (typically -2 to 7 range to 0-1)
            normalizedValue = (item.value + 2) / 9;
            break;
          case "tox21":
            // Assuming 0-1 already
            normalizedValue = item.value;
            break;
          case "binding_affinity":
            // Binding affinity (typically -14 to -4 range to 0-1)
            normalizedValue = (item.value + 14) / 10;
            break;
          case "bioavailability":
            // Assuming 0-1 already
            normalizedValue = item.value;
            break;
          default:
            // Fallback normalization for unknown properties
            normalizedValue = (item.value - -10) / 20; // Assuming -10 to 10 range
        }

        // Ensure value is between 0 and 1
        return Math.max(0, Math.min(1, normalizedValue));
      });

      const radarCtx = radarChartRef.current.getContext("2d");
      radarChartInstance.current = new Chart(radarCtx, {
        type: "radar",
        data: {
          labels: labels,
          datasets: [
            {
              label: prediction.drug_name,
              data: normalizedValues,
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgb(54, 162, 235)",
              borderWidth: 2,
              pointBackgroundColor: "rgb(54, 162, 235)",
              pointRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Property Profile",
              font: {
                size: 16,
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const originalValue = propertyData[context.dataIndex].value;
                  return `${context.label}: ${originalValue}`;
                },
              },
            },
          },
          scales: {
            r: {
              min: 0,
              max: 1,
              ticks: {
                display: false,
              },
            },
          },
        },
      });
    }

    // Cleanup function
    return () => {
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
      }
      if (radarChartInstance.current) {
        radarChartInstance.current.destroy();
      }
    };
  }, [prediction, selectedProperties]);

  if (!prediction || !selectedProperties || selectedProperties.length === 0) {
    return null;
  }

  return (
    <div className="charts-container">
      <h3>Property Analysis</h3>
      <div className="charts-grid">
        <div className="chart-card">
          <h4>Property Comparison</h4>
          <div className="chart-wrapper">
            <canvas ref={barChartRef}></canvas>
          </div>
        </div>

        {selectedProperties.length >= 3 && (
          <div className="chart-card">
            <h4>Property Profile</h4>
            <div className="chart-wrapper">
              <canvas ref={radarChartRef}></canvas>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertyCharts;
