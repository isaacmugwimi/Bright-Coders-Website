import React from "react";
import "../Css/BlogData.css";
import blogData from "../Utils/blogData";

const BlogPage = () => {
  return (
    <div className="blog-container">

      {/* HERO */}
      <div className="blog-hero">
        <h1>Bright Coders Blog</h1>
        <p>Tips, insights, and stories about coding and tech for kids & teens.</p>
      </div>

      {/* BLOG GRID */}
      <div className="blog-grid">
        {blogData.map((blog) => (
          <div className="blog-card" key={blog.id}>
            <img src={blog.image} alt={blog.title} />

            <div className="blog-content">
              <h3>{blog.title}</h3>
              <p>{blog.desc}</p>

              <div className="blog-meta">
                <span>{blog.author}</span>
                <span>{blog.date}</span>
              </div>

              <button className="read-more">Read More</button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default BlogPage;
