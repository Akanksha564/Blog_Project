import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom"; 
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import MyBlogs from "./pages/MyBlogs";
import CreateBlog from "./pages/CreateBlog";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import VerifyEmail from "./components/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";

const App = () => {
  const [user, setUser] = useState(null);
  const handleLogin = (userData) => {
    localStorage.setItem("access_token", userData.access);
    localStorage.setItem("user", JSON.stringify(userData.user));
    setUser(userData.user);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
  };
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log(storedUser)
    if (storedUser) {
      setUser(storedUser);
    }
  }, [user]);

  return (
    <>
      <Navbar isAuthenticated={user} user={user} onLogout={handleLogout} />
      <Routes>
      
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/my-blogs" element={<MyBlogs isAuthenticated ={user} user={user}/> } />
        <Route path="/login" element={<Login onLogin={handleLogin} setUser={setUser}/>} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/verify-akanksha/:uidb64/:token" element={<VerifyEmail />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
        <Route
          path="/create-blog"
          element={
            <ProtectedRoute isAuthenticated={!!user}>
              <CreateBlog />
            </ProtectedRoute>
          }
        /> 
        {/* <Route path="/create-blog" element={<CreateBlog />} /> */}
      </Routes>
    </>
  );
};

export default App;
