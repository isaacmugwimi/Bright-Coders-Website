import React, { useEffect } from "react";
import {
  Users,
  BookOpen,
  Award,
  TrendingUp,
  Bell,
  Search,
  ArrowUpRight,
  Plus,
  Download,
  Mail,
  MessageSquare,
  Layout,
  Newspaper,
  CheckCircle,
  ExternalLink,
  Send,
} from "lucide-react";
import { motion } from "framer-motion";
import "../Css/AdminDashBoard.css";
import EnrolmentTable from "./DashBoardComponents/EnrolmentTable";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashBoardBlog from "./DashBoardComponents/DashBoardBlog";
import DashBoardTestimonial from "./DashBoardComponents/DashBoardTestimonial";
import NotificationCenter from "./DashBoardComponents/NotificationCenter";
import {
  getAllBlogs,
  getAllCourses,
  getAllRegistrations,
  getAllTestimonials,
} from "../services/generalServices";
import { set } from "date-fns";
import NumberCounter from "number-counter";

const AdminDashBoard = () => {
  const navigate = useNavigate();
  const [recentEnrolments, setRecentEnrolments] = useState([]);
  const [pendingTestimonials, setPendingTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [blogs, setBlogs] = useState([]);

  // Animation Variants
  const containerVars = {
    animate: { transition: { staggerChildren: 0.1 } },
  };

  const itemVars = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  const stats = [
    {
      id: 1,
      label: "Total Students",
      value: recentEnrolments.length.toLocaleString(),
      icon: Users,
      color: "#3b82f6",
      trend: `+${recentEnrolments.length >= 100 ? "New" : "0"}`,
    },
    {
      id: 2,
      label: "Active Programs",
      value: courses.length.toLocaleString(),
      icon: Layout,
      color: "#10b981",
      trend: "Live",
    },
    {
      id: 3,
      label: "Blog Posts",
      value: blogs.length.toLocaleString(),
      icon: Newspaper,
      color: "#f59e0b",
      trend: "Active",
    },
    {
      id: 4,
      label: "Testimonials",
      value: pendingTestimonials.filter((t) => !t.is_approved).length,
      icon: MessageSquare,
      color: "#8b5cf6",
      trend: "Approval Req.",
    },
  ];

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch both in parallel for better performance
      const [enrolmentData, testimonialData, courseData, blogData] =
        await Promise.all([
          getAllRegistrations(),
          getAllTestimonials(),
          getAllCourses(),
          getAllBlogs(),
        ]);
      setRecentEnrolments(enrolmentData);
      setPendingTestimonials(testimonialData);
      setCourses(courseData);
      setBlogs(blogData);
    } catch (err) {
      console.error("Error fetching dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <motion.div
      variants={containerVars}
      initial="initial"
      animate="animate"
      className="admin-container"
    >
      {/* Header with Glassmorphism Search */}
      <header className="admin-header">
        <div className="header-left">
          <motion.h1 variants={itemVars}>Academy Insights</motion.h1>
          <motion.p variants={itemVars}>
            Managing Bright Coders Academy • Jan 2026
          </motion.p>
        </div>

        <div className="header-right">
          <div className="search-wrapper focus-ring">
            <input type="text" placeholder="Search anything..." />
            <Search size={40} className="search-shortcut" />
          </div>
          <div className="header-actions">
            {/* <motion.button
              whileHover={{ scale: 1.1 }}
              className="action-icon-btn"
              title="View System Alerts."
            >
              <Bell size={20} />
              <span className="notification-dot"></span>
            </motion.button> */}
            <NotificationCenter
              enrolments={recentEnrolments}
              testimonials={pendingTestimonials}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary-gradient"
            >
              <Plus size={18} />
              <span>New Entry</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Stats Cards with Hover Effects */}
      <div className="stats-grid">
        {stats.map((stat) => (
          <motion.div
            key={stat.id}
            variants={itemVars}
            whileHover={{ y: -5 }}
            className="stat-card"
          >
            <div className="stat-card-inner">
              <div
                className="stat-icon-box"
                style={{ background: `${stat.color}15`, color: stat.color }}
              >
                <stat.icon size={28} />
              </div>

              <div className="stat-info">
                <p className="stat-label">{stat.label}</p>
                <h3 className="stat-value">
                  {loading ? (
                    "..."
                  ) : isNaN(parseInt(stat.value)) ? (
                    stat.value
                  ) : (
                    <NumberCounter
                      start={0}
                      end={parseInt(stat.value.toString().replace(/,/g, ""))}
                    />
                  )}
                </h3>
                <span className="stat-trend positive">
                  <ArrowUpRight size={14} /> {stat.trend}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="left-content-stack">
          {/* Main Table: Students & Programs */}
          <motion.div
            variants={itemVars}
            className="content-card table-section"
          >
            <div className="card-header">
              <h2>Recent Enrolments</h2>
              <button
                className="btn-text"
                onClick={() => navigate("/studentRegistration")}
              >
                View All Students <ExternalLink size={18} />
              </button>
            </div>
            <EnrolmentTable
              students={recentEnrolments.slice(0, 2)}
              loading={loading}
            />
          </motion.div>

          {/* New Section: Recent Blog Drafts */}
          <motion.div
            variants={itemVars}
            className="content-card blogs-preview"
          >
            <div className="card-header">
              <h2>Blog Management</h2>
              <Newspaper size={18} color="#64748b" />
            </div>
            {/* <div className="blog-list">
              <div className="blog-item">
                <div className="blog-img-stub"></div>
                <div className="blog-details">
                  <h4>Top 10 AI Tools for Junior Devs</h4>
                  <p>Published: 2 hours ago • By Isaac</p>
                </div>
                <ExternalLink size={36} className="link-icon" onClick={()=> navigate("/blogs")}  />
              </div>
            </div> */}
            <DashBoardBlog />
          </motion.div>
        </div>

        <div className="side-cards">
          {/* Enhanced Quick Actions */}
          <motion.div
            variants={itemVars}
            className="content-card quick-actions-glass"
          >
            <h3>Publishing Actions</h3>
            <div className="action-stack">
              <button
                className="glass-action"
                onClick={() =>
                  navigate("/programs", { state: { openAddModal: true } })
                }
              >
                <Plus size={16} /> New Program
              </button>
              <button className="glass-action">
                <Send size={16} /> Send Announcement
              </button>
              <button
                className="glass-action"
                onClick={() =>
                  navigate("/blogs", { state: { openAddModal: true } })
                }
              >
                <Newspaper size={16} /> Create Blog Post
              </button>
            </div>
          </motion.div>

          {/* Testimonials Approval */}
          <motion.div
            variants={itemVars}
            className="content-card testimonial-card"
          >
            <h3>Pending Approval</h3>

            <DashBoardTestimonial
              testimonials={pendingTestimonials}
              loading={loading}
              refreshData={fetchDashboardData} // Important for approval logic
            />
          </motion.div>

          {/* System Health */}
          <motion.div
            variants={itemVars}
            className="content-card system-health"
          >
            <h3>Live Monitoring</h3>
            <div className="health-row">
              <div className="status-indicator-group">
                <span className="dot online"></span> Database
              </div>
              <div className="status-indicator-group">
                <span className="dot online"></span> API Server
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashBoard;
