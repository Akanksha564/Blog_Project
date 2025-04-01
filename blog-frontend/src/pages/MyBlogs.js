import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const MyBlogs = ({ isAuthenticated, user }) => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate(); 
 

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
        navigate("/blogs");
        return;
    }
    const fetchMyBlogs = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/my-blogs/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });

        if (response.data && response.data.results) {
          setBlogs(response.data.results);
        } else {
          setBlogs([]);
        }
      } catch (error) {
        console.error("Error fetching my blogs:", error);
        setBlogs([]);
      }
    };

    fetchMyBlogs();
  }, [user]);

  const handleDelete = async (blogId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/blogs/${blogId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogId)); 
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  return (
    <>
      <div className="container mt-5 pt-5 mb-3 pd-3">
        <h2 className="text-center mb-4">My Blogs</h2>

        {blogs.length === 0 ? (
            <div className="alert alert-warning text-center" role="alert">
            No blogs found. Start writing one!
            </div>
        ) : (
            <div className="row g-4">
            {blogs.map((blog) => (
                <div key={blog.id} className="col-md-4">
                <div className="card shadow-sm border-0 h-100">
                    <img
                    src={blog.image || "https://via.placeholder.com/300"}
                    className="card-img-top rounded-top"
                    alt="Blog"
                    style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{blog.title}</h5>
                    <p className="card-text text-muted">
                        {blog.description.substring(0, 100)}...
                    </p>
                    <div className="mt-auto mt-2 pt-2">
                        <Link to={`/blogs/${blog.id}`} className="btn btn-primary btn-sm">
                        Read More
                        </Link>
                        <button
                        className="btn btn-outline-danger btn-sm mt-2 pt-2"
                        onClick={() => handleDelete(blog.id)}
                        >
                        Delete
                        </button>
                    </div>
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}
      </div>

    </>
  );
};

export default MyBlogs;
