import React, { useState, useRef, useEffect, useMemo } from "react";
import { Bell, UserPlus, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Notification.css";

const NotificationCenter = ({ enrolments = [], testimonials = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [activeId, setActiveId] = useState(null);

  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Convert raw data into notifications
  const notifications = useMemo(() => {
    const list = [];
    const fallbackDate = new Date();

    // Enrolments
    enrolments.slice(0, 3).forEach((item) => {
      list.push({
        id: `enrol-${item.id}`,
        text: `New student: ${item.child_name || "Someone"} joined ${
          item.course_name || "a course"
        }`,
        time: "Recent",
        type: "enrolment",
        date: item.created_at ? new Date(item.created_at) : fallbackDate,
        link: `/studentRegistration`, // ✅ click target
      });
    });

    // Testimonials
    testimonials
      .filter((t) => !t.is_approved)
      .forEach((item) => {
        list.push({
          id: `test-${item.id}`,
          text: `New testimonial pending from ${item.user_name}`,
          time: "Pending",
          type: "testimonial",
          date: item.created_at ? new Date(item.created_at) : fallbackDate,
          link: `/testimonials`, // ✅ click target
        });
      });

    return list.sort((a, b) => b.date - a.date);
  }, [enrolments, testimonials]);

  return (
    <div className="notification-container" ref={dropdownRef}>
      <button
        className="action-icon-btn"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Bell size={20} />
        {notifications.length > 0 && <span className="notification-dot"></span>}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="notifications-dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="dropdown-header">
              <h3>Recent Activity</h3>
            </div>

            <div className="notifications-list">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="notification-item clickable"
                    onClick={() => {
                      navigate(n.link, {
                        state: { highlightId: n.id, type: n.type },
                      });
                      setIsOpen(false);
                    }}
                  >
                    <div className="notif-icon">
                      {n.type === "enrolment" ? (
                        <UserPlus size={14} />
                      ) : (
                        <MessageSquare size={14} />
                      )}
                    </div>

                    <div className="notif-details">
                      <p>
                        <strong>
                          {n.type === "enrolment"
                            ? "New Student: "
                            : "New Testimonial: "}
                        </strong>
                        {n.text
                          .replace("New student: ", "")
                          .replace("New testimonial pending from ", "")}
                      </p>
                      <span>{n.time}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">All caught up!</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
