import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getDashboardStats = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/dashboard/stats`
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to fetch dashboard stats",
      }
    );
  }
};