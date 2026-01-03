import React from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import { getAllBlogs } from "../../services/generalServices";
import { formatDistanceToNow } from "date-fns";

const DashBoardBlog = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await getAllBlogs();
      setBlogs(data.slice(0, 1));
    } catch (err) {
      console.error("Error fetching blogs");
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <p style={{ padding: "1rem" }}>Loading blogs...</p>;
  }

  return (
    <div className="blog-list">
      <div className="blog-item">
        {blogs.map((blog, index) => (
          <React.Fragment key={blog.id || index}>
            {blog.image_url ? (
              <div className="course-img-container">
                <img
                  src={blog.image_url || "/placeholder-blog.png"}
                  alt={blog.title}
                />
              </div>
            ) : (
              <div className="blog-img-stub">
                {/* You can even put the first letter of the title here */}
                <span>{blog.title?.charAt(0)}</span>
              </div>
            )}
            <div className="blog-details">
              <h4>{blog.title}</h4>

              <p>
                Published: {formatDistanceToNow(new Date(blog.created_at))} ago
                <span
                  className="separator"
                  style={{
                    marginLeft: "15px",
                    marginRight: "5px",
                    color: "#94a3b8",
                    fontWeight: "bold",
                  }}
                >
                  •
                </span>
                By {blog.author || "Bright Coders Team"}
              </p>
            </div>
          </React.Fragment>
        ))}

        <ExternalLink
          size={36}
          className="link-icon"
          onClick={() => navigate("/blogs")}
        />
      </div>
    </div>
  );
};

export default DashBoardBlog;
