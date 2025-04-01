
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Comments from "./Comments"; 
import "../styles/BlogStyles.css";


const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [openComments, setOpenComments] = useState({});

  const fetchBlogs = async (page = 1) => {
    const token = localStorage.getItem("token");
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/blogs/?page=${page}`, {
        method: "GET",
        headers: {
          Authorization: token ? `Bearer ${token}` : "", 
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("API Response Data:", data); 

      if (data.results) {
        setBlogs(data.results);
        setNextPage(data.next);
        setPrevPage(data.previous);
      } else if (Array.isArray(data)) { 
        setBlogs(data);
        setNextPage(null);
        setPrevPage(null);
      } else {
        console.error("Unexpected response format:", data);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(currentPage);
  }, [currentPage]);

  const goToNextPage = () => {
    if (nextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (prevPage) {
      setCurrentPage((prev) => Math.max(prev - 1, 1));
    }
  };

  if (loading) return <p>Loading blogs...</p>;

  return (
    <div className="container mt-4 pt-4">
      <h2 className="container mt-3 pt-3">All Blogs</h2>
  
      {blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        // Wrap blogs inside the new blog-list div
        <div className="blog-list">
          {blogs.map((blog) => (
            <div key={blog.id} className="card">
              <div className="card-body">
                <h3>{blog.title}</h3>
                <p>{blog.description.substring(0, 100)}...</p>
                {blog.image && <img src={blog.image} alt="Blog" width="200" />}
  
                <Link to={`/blogs/${blog.id}`} className="btn btn-primary">
                  Read More
                </Link>
  
                <button
                  onClick={() =>
                    setOpenComments({ ...openComments, [blog.id]: !openComments[blog.id] })
                  }
                  className="btn btn-secondary ml-2"
                >
                  {openComments[blog.id] ? "Hide Comments" : "View Comments"}
                </button>
  
                {openComments[blog.id] && <Comments blogId={blog.id} />}
              </div>
            </div>
          ))}
        </div>
      )}
  
      <div className="mt-3 mb-2 pd-2">
        <button className="btn btn-info" onClick={goToPreviousPage} disabled={!prevPage}>
          Previous
        </button>
  
        <span className="mx-3">Page {currentPage}</span>
  
        <button className="btn btn-info" onClick={goToNextPage} disabled={!nextPage}>
          Next
        </button>
      </div>
    </div>
  );  
};

export default Blogs;
