
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";

const Login = ({setUser}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");  
    const navigate = useNavigate();
    const [showResendButton, setShowResendButton] = useState(false); 

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setShowResendButton(false); 


        try {
            const response = await axios.post("http://127.0.0.1:8000/api/token/", {
                email: email,
                password: password,
            });

            console.log("Login Response:", response.data);

            const { access, refresh, user } = response.data;

            if (!user) {
                throw new Error("User data missing from response");
            }

            localStorage.setItem("access_token", access);
            localStorage.setItem("refresh_token", refresh);
            localStorage.setItem("user", JSON.stringify(user));
            setUser(user)
        
            navigate("/blogs");
        } 
        catch (error) {
            console.error("Login Error:", error.response?.data || error);
            let errorMessage = error.response?.data?.error;

            if (Array.isArray(errorMessage)) {
                errorMessage = errorMessage[0];
            }
            setError(errorMessage);
            if (typeof errorMessage === "string" && errorMessage.toLowerCase().includes("verified")) {
                setShowResendButton(true);
            }

        }
        
        
        
    };
    const handleResendVerification = async () => {
        setMessage("");
        setError("");

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/auth/resend-verification/", {
                email,
            });

            setMessage("A new verification email has been sent. Please check your inbox.");
            setShowResendButton(false);
        } catch (error) {
            console.error("Resend Email Error:", error.response?.data || error);
            setError("Failed to resend verification email. Please try again.");
        }
    };
    const handleForgotPassword = async () => {
        const response = await fetch("http://127.0.0.1:8000/api/auth/reset-password/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
    
        const data = await response.json();
        alert(data.message);
      };

    return (
        <div className="container-fluid p-0">
            <div className="d-flex align-items-center px-3 py-2 mt-5 pt-5">
                <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                    <FaArrowLeft className="me-2" /> Back
                </button>
            </div>

            <div className="d-flex justify-content-center align-items-center vh-10">
                <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
                    <h2 className="text-center mb-4">Login</h2>

                    {message && <div className="alert alert-success">{message}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="d-grid gap-2">
                            <button type="submit" className="btn btn-primary">Login</button>
                            <button type="button" className="btn btn-link text-decoration-none" onClick={handleForgotPassword}>
                                Forgot Password?
                            </button>
                        </div>
                    </form>

                    {showResendButton && (
                        <button onClick={handleResendVerification} className="btn btn-warning mt-3 w-100">
                            Resend Verification Email
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
