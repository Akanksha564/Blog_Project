
import React, { useEffect, useState } from "react";
import axios from "axios";
import refreshToken from "./refreshToken"; 
const Comments = ({ blogId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const token = localStorage.getItem("access_token");
  const loggedInUser = localStorage.getItem("user");

  useEffect(() => {
    const fetchComments = async () => {
      if (!blogId) return;

      try {
        const response = await axios.get(
          `http://localhost:8000/api/comments/?blog=${blogId}`,
          // { headers: { Authorization: `Bearer ${token}`  } }
        );

        console.log("Fetched Comments:", response.data); 
        setComments(Array.isArray(response.data.results) ? response.data.results : response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setComments([]);
      }
    };

    fetchComments();
  }, [token, blogId]);

  // ✅ Handle Posting a New Comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    let accessToken = token;

    if (!accessToken) {
      console.error("No token found, user must be logged in");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/comments/",
        { content: newComment, blog: blogId }, 
        { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }
      );

      console.log("New Comment:", response.data); 
      setComments((prevComments) => [...prevComments, response.data]);
      setNewComment("");
    } catch (error) {
      if (error.response?.status === 401) {
        accessToken = await refreshToken();
        if (accessToken) {
          await handleCommentSubmit(e);
        } else {
          console.error("User must log in again");
        }
      } else {
        console.error("Error posting comment:", error.response?.data);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:8000/api/comments/${commentId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
    } catch (error) {
      console.error("Error deleting comment:", error.response?.data);
    }
  };
  return (
    <div className="mt-4">
      <h4>Comments</h4>
      <ul className="list-group">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <li key={comment.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <strong>{comment.user?.username || "Unknown"}:</strong>
                <span className="ms-2">{comment.content || comment.text}</span> {/* ✅ Fix: Show actual comment content */}
              </div>
              {token && (comment.username === loggedInUser.username) && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  🗑️
                </button>
              )}

            </li>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </ul>

      {/* ✅ Comment Form */}
      {token ? (
        <form onSubmit={handleCommentSubmit} className="mt-3">
          <textarea
            className="form-control"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            required
          />
          <button type="submit" className="btn btn-primary mt-2">Submit</button>
        </form>
      ) : (
        <p><strong>Login to comment</strong></p>
      )}
    </div>
  );
};

export default Comments;

