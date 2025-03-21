import axios from 'axios';

const API_URL = 'http://localhost:5000/api/user';

const getSubmissions = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/submissions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export default { getPastResults, getSubmissions };
