import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { uid, token } = useParams(); // Get uid and token from the URL
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = async () => {
    const response = await fetch(`http://127.0.0.1:8000/api/auth/reset-password/${uid}/${token}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ new_password: newPassword }),
    });

    const data = await response.json();
    setMessage(data.message || data.error);

    if (response.ok) {
      setTimeout(() => {
        navigate("/login"); // Redirect to login after 2 seconds
      }, 2000);
    }
  };

  return (
    <div className="reset-password-wrapper mt-5 pt-5 ">
      <div className="reset-password-container">
        <h2>Reset Your Password</h2>
        <input
          type="password"
          placeholder="Enter New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={handleResetPassword}>Submit</button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
