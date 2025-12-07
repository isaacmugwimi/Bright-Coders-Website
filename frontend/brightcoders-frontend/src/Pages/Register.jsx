import React, { useState } from "react";
import programData from "../Utils/programData";
import "../Css/Register.css"

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    grade: "",
    course: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // TODO: send to backend & integrate payment
  };

  return (
    <div className="register-page">
      <h1>Register for a Course</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="grade"
          placeholder="Grade / Age"
          value={formData.grade}
          onChange={handleChange}
          required
        />
        <select
          name="course"
          value={formData.course}
          onChange={handleChange}
          required
        >
          <option value="">Select a course</option>
          {programData.flatMap((cat) =>
            cat.items.map((item, index) => (
              <option key={index} value={item.title}>
                {item.title} ({cat.category})
              </option>
            ))
          )}
        </select>

        <button type="submit">Proceed to Payment</button>
      </form>
    </div>
  );
};

export default Register;
