import React, { useState, useEffect } from 'react';
import './ForgotPassword.css';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const ForgotPassword = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post(API_PATHS.PASSWORD_RESET.REQUEST, { email });
      setSubmitted(true);
    } catch (error) {
      alert(error.response?.data?.message || "Error sending reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* stopPropagation prevents clicking the card from closing the modal */}
      <div className="forgot-card modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-x" onClick={onClose}>&times;</button>
        
        {submitted ? (
          <div className="success-state">
            <div className="icon-circle">📩</div>
            <h2>Check your email</h2>
            <p
            style={{marginBottom:"20px"}}>Instructions sent to <strong>{email}</strong></p>
            <button className="btn-primary" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <h2>Reset Password</h2>
            <p className="subtitle">Enter your <b>user email</b> and we'll send you a recovery link.</p>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required 
                  autoFocus
                />
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Sending..." : "Send Link"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;