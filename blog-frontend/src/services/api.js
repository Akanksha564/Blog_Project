
// export default api;
import axios from "axios";
import jwtDecode from "jwt-decode";

const API_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Function to get a new access token using the refresh token
const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) return null;

    const response = await axios.post(`${API_URL}/auth/token/refresh/`, { refresh });
    localStorage.setItem("token", response.data.access);
    return response.data.access;
  } catch (error) {
    console.error("Error refreshing token:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    return null;
  }
};

// Axios interceptor to refresh token if expired
api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decodedToken.exp < now) {
        token = await refreshToken();
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
