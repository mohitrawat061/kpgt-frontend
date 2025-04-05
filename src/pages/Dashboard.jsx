import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { fetchDashboardData } from "../services/apiService";
import "./Dashboard.css";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  if (loading) return <div className="loading">Loading dashboard data...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!dashboardData) return <div className="no-data">No data available</div>;

  return (
    <div className="page-container dashboard-container">
      <h1>Dashboard</h1>

      <div className="metrics-summary">
        <div className="metric-card">
          <h3>Total Predictions</h3>
          <p className="metric-value">{dashboardData.totalPredictions}</p>
        </div>
        <div className="metric-card">
          <h3>Accuracy</h3>
          <p className="metric-value">{dashboardData.accuracy}%</p>
        </div>
        <div className="metric-card">
          <h3>Active Users</h3>
          <p className="metric-value">{dashboardData.activeUsers}</p>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-container">
          <h2>Prediction Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.predictionDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h2>Model Performance Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData.performanceOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="accuracy" stroke="#8884d8" />
              <Line type="monotone" dataKey="precision" stroke="#82ca9d" />
              <Line type="monotone" dataKey="recall" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h2>Feature Importance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboardData.featureImportance}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {dashboardData.featureImportance.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
