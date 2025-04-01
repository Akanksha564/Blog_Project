
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Comments from "./Comments";
import { FaArrowLeft } from "react-icons/fa";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [updatedBlog, setUpdatedBlog] = useState({ title: "", description: "" });
  const [selectedImage, setSelectedImage] = useState(null); // ✅ New state for image

  const token = localStorage.getItem("access_token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/blogs/${id}/`, {
      headers: {  } 
    })
    .then(response => {
      setBlog(response.data);
      setUpdatedBlog({ title: response.data.title, description: response.data.description });
      setLoading(false);
    })
    .catch(error => {
      console.error("Error fetching blog:", error);
      setLoading(false);
      if (error.response?.status === 401) {
        alert("Session expired! Please log in again.");
        navigate("/login"); 
      }
    });
  }, [id, navigate, token]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/blogs/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 204) {
        alert("Blog deleted successfully!");
        navigate("/blogs");
      } else {
        alert("Failed to delete blog.");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);

      if (error.response?.status === 404) {
        alert("Blog not found. It may have already been deleted.");
      } else if (error.response?.status === 403) {
        alert("You are not authorized to delete this blog.");
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("title", updatedBlog.title);
      formData.append("description", updatedBlog.description);
      if (selectedImage) formData.append("image", selectedImage); // ✅ Append image if selected

      const response = await axios.patch(
        `http://127.0.0.1:8000/api/blogs/${id}/`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        setBlog(response.data);
        setEditMode(false);
        setSelectedImage(null);
        alert("Blog updated successfully!");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("Failed to update blog. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!blog) return <p>Blog not found.</p>;

  return (
    <div className="container mt-5 ">
      <button className="btn btn-light  mt-5" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

      {editMode ? (
        <div>
          <h2>Edit Blog</h2>
          <input
            type="text"
            className="form-control mb-2"
            value={updatedBlog.title}
            onChange={(e) => setUpdatedBlog({ ...updatedBlog, title: e.target.value })}
          />
          <textarea
            className="form-control mb-2"
            value={updatedBlog.description}
            onChange={(e) => setUpdatedBlog({ ...updatedBlog, description: e.target.value })}
          />

          <div className="mb-2">
            <label className="form-label">Upload New Image:</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setSelectedImage(e.target.files[0])}
            />
            {selectedImage && (
              <img src={URL.createObjectURL(selectedImage)} alt="Preview" className="img-fluid mt-2" style={{ maxHeight: "50px" }} />
            )}
          </div>

          <button className="btn btn-success me-2" onClick={handleUpdate}>Save</button>
          <button className="btn btn-secondary" onClick={() => setEditMode(false)}>Cancel</button>
        </div>
      ) : (
        <div className="mb-2 pb-2 mt-2 pt-2">
          <h2>{blog.title}</h2>
          {blog.image && <img src={blog.image} alt={blog.title} className="img-fluid" style={{ maxHeight: "400px" }} />}
          <p>{blog.description}</p>
          <p><strong>Author:</strong> {blog.author}</p>
          <hr />
          <Comments blogId={id} />

          {user && user.name === blog.author && (
            <>
              <button className="btn btn-warning me-2 mt-2 mb-2 pd-2" onClick={() => setEditMode(true)}>Edit</button>
              <button className="btn btn-danger me-2 mt-2 mb-2 pd-2" onClick={handleDelete}>Delete</button>
            </>
          )}
        </div>
      )}
    </div>

  );
};

export default BlogDetail;

