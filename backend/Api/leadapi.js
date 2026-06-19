import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const createLead = async (leadData) => {
  try {
    const response = await axios.post(
      `${API_URL}/lead`,
      leadData
    );


    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to submit lead",
      }
    );
  }
};

export const getAllLeads = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/admin/leads`
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to fetch leads",
      }
    );
  }
};