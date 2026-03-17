import React, { useEffect, useState } from "react";
import "../Css/BlogData.css";
import axios from "axios";
import {
  Loader2,
  X,
  Calendar,
  User,
  CheckCircle2,
  Tag,
  Share2,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const siteUrl = import.meta.env.VITE_SITE_URL;
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchPublicBlogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/blogs/live`);
        const rawData = response.data.data || response.data;

        const publicOnly = rawData.filter(
          (blog) => blog.is_public === true || blog.is_public === 1,
        );
        setBlogs(publicOnly);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicBlogs();
  }, [API_URL]);

  const handleShare = async (blog) => {
    const shareData = {
      title: blog.title,
      text: blog.summary || "Check out this blog from Bright Coders!",
      url: `${siteUrl}/blog/${blog.id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard if Share API isn't supported
        await navigator.clipboard.writeText(shareData.url);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  // ================= Structured Data for Blogs =================
  const generateJSONLD = () => ({
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Bright Coders Blog",
    url: `${siteUrl}/blog`,
    description:
      "Tips, insights, and stories about coding and tech for kids & teens.",
    blogPost: blogs.map((blog) => ({
      "@type": "BlogPosting",
      headline: blog.title,
      image: blog.image_url || `${siteUrl}/placeholder-blog.png`,
      author: {
        "@type": "Person",
        name: blog.author,
      },
      datePublished: blog.created_at,
      description: blog.summary || "No description available.",
      url: `${siteUrl}/blog/${blog.id}`,
    })),
  });

  return (
    <>
      {/* ================= SEO ================= */}
      <Helmet>
        <title>
          {selectedBlog
            ? `${selectedBlog.title} | Bright Coders Blog`
            : "Bright Coders Blog | Coding for Kids & Teens in Kenya"}
        </title>
        <meta
          name="description"
          content={
            selectedBlog?.summary ||
            "Explore Bright Coders’ blog for tips, insights, and stories about coding for children."
          }
        />
        <link
          rel="canonical"
          href={
            selectedBlog
              ? `${siteUrl}/blog/${selectedBlog.id}`
              : `${siteUrl}/blog`
          }
        />

        {/* --- Open Graph / Social Sharing --- */}
        {/* If a blog is selected, use its data. Otherwise, use the general blog page data. */}
        <meta
          property="og:title"
          content={selectedBlog?.title || "Bright Coders Blog"}
        />
        <meta
          property="og:description"
          content={
            selectedBlog?.summary ||
            "Tips, insights, and stories about coding and tech for kids & teens."
          }
        />
        <meta
          property="og:image"
          content={selectedBlog?.image_url || `${siteUrl}/og-blog.jpg`}
        />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={
            selectedBlog
              ? `${siteUrl}/blog/${selectedBlog.id}`
              : `${siteUrl}/blog`
          }
        />

        {/* --- Structured Data --- */}
        {blogs.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify(generateJSONLD())}
          </script>
        )}
      </Helmet>

      {/* ================= PAGE CONTENT ================= */}
      <div className="blog-container">
        <div className="blog-hero">
          <h1>Bright Coders Blog</h1>
          <p>
            Tips, insights, and stories about coding and tech for kids & teens.
          </p>
        </div>

        {loading ? (
          <div className="loading-container" id="programs-grid">
            <div className="simple-spinner"></div>
            <p>Loading stories...</p>
          </div>
        ) : (
          <div className="blog-grid">
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <div className="blog-card" key={blog.id}>
                  <div className="card-image-wrapper">
                    <img
                      src={blog.image_url || "/placeholder-blog.png"}
                      alt={blog.title}
                    />
                    <span className="category-badge">{blog.category}</span>
                  </div>

                  <div className="blog-content">
                    <h2>{blog.title}</h2>
                    <p className="blog-summary-text">
                      {blog.summary || "No description available."}
                    </p>

                    <div className="blog-meta">
                      <span>
                        <User size={14} /> {blog.author}
                      </span>
                      <span>
                        <Calendar size={14} />{" "}
                        {new Date(blog.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <button
                      className="read-more"
                      onClick={() => setSelectedBlog(blog)}
                      aria-label={`Read full story: ${blog.title}`}
                    >
                      Read Full Story
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-blogs">
                <p>No stories published yet. Check back soon!</p>
              </div>
            )}
          </div>
        )}

        {/* --- READ MORE MODAL --- */}
        {selectedBlog && (
          <div
            className="blog-modal-overlay"
            onClick={() => setSelectedBlog(null)}
          >
            <div
              className="blog-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-modal"
                onClick={() => setSelectedBlog(null)}
              >
                <X size={24} />
              </button>

              <img
                src={selectedBlog.image_url || "/placeholder-blog.png"}
                alt={selectedBlog.title}
                className="modal-image"
              />

              <div className="modal-body">
                <div className="modal-header-info">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span className="modal-category">
                      <Tag size={14} /> {selectedBlog.category}
                    </span>
                    <button
                      onClick={() => handleShare(selectedBlog)}
                      className="share-btn"
                      title="Share Blog"
                    >
                      <Share2 size={20} />
                    </button>
                  </div>
                  <h2>{selectedBlog.title}</h2>
                  <div className="modal-meta">
                    <span>
                      <User size={14} /> By{" "}
                      <span className="author">{selectedBlog.author}</span>
                    </span>
                    <span>
                      <Calendar size={14} />{" "}
                      {new Date(selectedBlog.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <hr />

                <div className="modal-main-section">
                  <div className="full-content">
                    <h4>Article</h4>
                    <p>{selectedBlog.content}</p>
                  </div>

                  {selectedBlog.key_highlights &&
                    selectedBlog.key_highlights.length > 0 && (
                      <div className="highlights-section">
                        <h4>Key Highlights & Requirements</h4>
                        <ul className="highlights-list">
                          {selectedBlog.key_highlights.map((item, index) => (
                            <li key={index}>
                              <CheckCircle2 size={16} className="check-icon" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BlogPage;
