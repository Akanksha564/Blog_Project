
import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(""); 
        setError("");

        try {
            const response = await axios.post("http://localhost:8000/api/auth/register/", formData, {
                headers: { "Content-Type": "application/json" }
            });

            setMessage(response.data.message);
            alert("Verification email sent. Check your inbox!"); 
            setFormData({ username: "", email: "", password: "" });
        } catch (err) {
            console.error("Registration error:", err.response?.data || err.message);
            setError(err.response?.data || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
                <h2 className="text-center mb-4">Register</h2>
                
                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{JSON.stringify(error)}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input type="text" name="username" className="form-control" placeholder="Enter username" value={formData.username} onChange={handleChange} required />
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" name="email" className="form-control" placeholder="Enter email" value={formData.email} onChange={handleChange} required />
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input type="password" name="password" className="form-control" placeholder="Enter password" value={formData.password} onChange={handleChange} required />
                    </div>
                    
                    <button type="submit" className="btn btn-primary w-100">Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
