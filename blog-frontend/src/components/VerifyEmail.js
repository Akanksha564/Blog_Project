import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
    const { uidb64, token } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/auth/verify-akanksha/${uidb64}/${token}/`);
                setMessage(response.data.message);
                
                
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            } catch (err) {
                setError(err.response?.data.error || "Email verification failed.");
            }
        };

        verifyEmail();
    }, [uidb64, token, navigate]);

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div className="card shadow-lg p-4 text-center" style={{ maxWidth: "400px", width: "100%" }}>
                <h2>Email Verification</h2>
                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                <p>Redirecting to login...</p>
            </div>
        </div>
    );
};

export default VerifyEmail;


