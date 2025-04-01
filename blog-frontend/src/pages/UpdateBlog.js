import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateBlog = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/blogs/${id}/`)
      .then((response) => {
        setTitle(response.data.title);
        setContent(response.data.content);
      })
      .catch((error) => console.error(error));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://127.0.0.1:8000/api/blogs/${id}/`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Blog updated successfully!");
      navigate("/blogs");
    } catch (error) {
      alert("Failed to update blog.");
    }
  };

  return (
    <div className="container">
      <h2>Update Blog</h2>
      <form onSubmit={handleUpdate}>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateBlog;
