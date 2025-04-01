import axios from "axios";

const refreshToken = async () => {
  try {
    const response = await axios.post("http://localhost:8000/api/token/refresh/", {
      refresh: localStorage.getItem("refresh_token"),
    });

    const newAccessToken = response.data.access;
    localStorage.setItem("token", newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login"; 
    return null;
  }
};

export default refreshToken;
