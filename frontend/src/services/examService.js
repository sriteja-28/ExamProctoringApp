import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const getScheduledExams = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. User might not be authenticated.");
      return null;
    }
    const response = await axios.get(`${API_BASE_URL}/exams`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching scheduled exams:",
      error.response?.data || error.message
    );
    return null;
  }
};

const registerExam = async (examId) => {
  const response = await axios.post(
    `${API_BASE_URL}/exams/${examId}/start`,
    {},
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
  );
  return response.data;
};

const getExam = async (examId) => {
  const response = await axios.get(`${API_BASE_URL}/exams/${examId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};

const submitExam = async (examId, data) => {
  const response = await axios.post(
    `${API_BASE_URL}/exams/${examId}/submit`,
    data,
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
  );
  return response.data;
};

const cancelExam = async (examId, data) => {
  const response = await axios.post(
    `${API_BASE_URL}/exams/${examId}/cancel`,
    data,
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
  );
  return response.data;
};


export default {
  getScheduledExams,
  registerExam,
  getExam,
  submitExam,
  cancelExam,
};
