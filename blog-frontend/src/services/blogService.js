import api from "./api";

// Get all blogs
export const getBlogs = async () => {
  try {
    const response = await api.get("/blogs/");
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error fetching blogs";
  }
};

// Get a single blog by ID
export const getBlogById = async (blogId) => {
  try {
    const response = await api.get(`/blogs/${blogId}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error fetching blog details";
  }
};

// Create a new blog (Authenticated users only)
export const createBlog = async (blogData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.post("/blogs/", blogData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error creating blog";
  }
};

// Update a blog (Authenticated users only)
export const updateBlog = async (blogId, blogData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.put(`/blogs/${blogId}/`, blogData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error updating blog";
  }
};

// Delete a blog (Authenticated users only)
export const deleteBlog = async (blogId) => {
  try {
    const token = localStorage.getItem("token");
    await api.delete(`/blogs/${blogId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return "Blog deleted successfully";
  } catch (error) {
    throw error.response?.data || "Error deleting blog";
  }
};
