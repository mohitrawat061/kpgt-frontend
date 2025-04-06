import axios from "axios";

// Define the base URL for your API
const API_BASE_URL = "http://localhost:5000/api"; // Update this to your backend URL

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: "https://kpgt-backend-5a2s.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to make prediction requests
export const makeApiRequest = async (endpoint, data) => {
  try {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// Function to fetch dashboard data
export const fetchDashboardData = async () => {
  try {
    const response = await apiClient.get("/dashboard");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    throw error;
  }
};

// Function to fetch model details
export const fetchModelDetails = async () => {
  try {
    const response = await apiClient.get("/model-details");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch model details:", error);
    throw error;
  }
};

// Function to upload a file (e.g., for batch predictions)
export const uploadFile = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await apiClient.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        if (onUploadProgress) {
          onUploadProgress(percentCompleted);
        }
      },
    });
    return response.data;
  } catch (error) {
    console.error("File upload failed:", error);
    throw error;
  }
};
