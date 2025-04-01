import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateBlog = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState(""); 
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem("access_token");
        if (!token) {
            setError("You must be logged in to create a blog.");
            return;
        }
        

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description); 
        if (image) {
            formData.append("image", image);
        }

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/create-blogs/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.status === 201) {
                navigate("/blogs");
            }
        } catch (error) {
            console.error("Error creating blog:", error.response?.data || error);
            setError(error.response?.data?.description?.[0] || "Failed to create blog. Please try again.");
        }
    };

    return (
        <div className="container mt-5 pt-5">
            <h2>Create a New Blog</h2>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        rows="5"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>

                <div className="mb-3">
                    <label className="form-label">Upload Image</label>
                    <input type="file" className="form-control" onChange={handleImageChange} required/>
                </div>

                <button type="submit" className="btn btn-primary">Create Blog</button>
            </form>
        </div>
    );
};

export default CreateBlog;
