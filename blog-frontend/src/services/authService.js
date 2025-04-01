import api from "./api"; // Import the configured axios instance
import jwtDecode from "jwt-decode";

export const register = async (userData) => {
  try {
    const response = await api.post("/auth/register/", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Registration failed";
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login/", credentials);
    const { access, refresh } = response.data;

    localStorage.setItem("token", access);
    localStorage.setItem("refreshToken", refresh);

    return jwtDecode(access); // Decode token to get user details
  } catch (error) {
    throw error.response?.data || "Login failed";
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
};

export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await api.post("/token/refresh/", { refresh: refreshToken });
    localStorage.setItem("token", response.data.access);
    return response.data.access;
  } catch (error) {
    logout();
    throw error.response?.data || "Session expired, please log in again";
  }
};
