// EnrolmentTable.jsx
import React from "react";
import { useEffect } from "react";
import { getAllRegistrations } from "../../services/generalServices";
import { useState } from "react";

const EnrolmentTable = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const getInitials = (name) => {
    if (!name) return "??";
    const names = name.trim().split(/\s+/);
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const data = await getAllRegistrations();
      setStudents(data.slice(0,2));
    } catch (err) {
      console.error("Error from Enroll Table");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p style={{ padding: "1rem" }}>Loading students...</p>;
  }

  return (
    <>
      <table className="modern-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Program</th>
            <th>Status</th>
            <th>Activity</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index}>
              <td>
                <div className="user-cell">
                  <div className="u-avatar">
                    {" "}
                    {getInitials(student.child_name)}
                  </div>
                  {student.child_name}
                </div>
              </td>
              <td>{student.course_name}</td>
              <td>
                <span
                  className={`badge ${
                    student.payment_status === "paid" ? "public" : "draft"
                  }`}
                >
                  {student.payment_status.replace("_", " ")}
                </span>
              </td>
              <td>
                <div className="mini-chart"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default EnrolmentTable;
