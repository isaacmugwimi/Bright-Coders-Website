import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import './ResetPassword.css';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
    const [status, setStatus] = useState({ loading: false, error: '', success: false });

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return setStatus({ ...status, error: "Passwords do not match" });
        }

        setStatus({ ...status, loading: true, error: '' });

        try {
            // 1. Fetch CSRF token (required for the /confirm POST route)
            const { data: csrfData } = await axiosInstance.get(API_PATHS.SECURITY.CSRF_TOKEN);
            
            // 2. Submit new password
            await axiosInstance.post(
                API_PATHS.PASSWORD_RESET.CONFIRM,
                { token, newPassword: passwords.newPassword },
                { headers: { 'X-CSRF-Token': csrfData.csrfToken } }
            );

            setStatus({ loading: false, success: true, error: '' });
            setTimeout(() => navigate('/authentication'), 3000);
        } catch (err) {
            setStatus({
                loading: false,
                error: err.response?.data?.message || "Failed to reset password. Link may be expired.",
                success: false
            });
        }
    };

    if (status.success) {
        return (
            <div className="reset-container">
                <div className="reset-card success-card">
                    <h2>Success! 🎉</h2>
                    <p>Your password has been reset. Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="reset-container">
            <div className="reset-card">
                <h2>Set New Password</h2>
                <p>Please enter a strong password for your account.</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>New Password</label>
                        <input 
                            type="password" 
                            name="newPassword"
                            value={passwords.newPassword}
                            onChange={handleChange}
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label>Confirm Password</label>
                        <input 
                            type="password" 
                            name="confirmPassword"
                            value={passwords.confirmPassword}
                            onChange={handleChange}
                            required 
                        />
                    </div>

                    {status.error && <p className="error-msg">{status.error}</p>}

                    <button type="submit" disabled={status.loading}>
                        {status.loading ? "Updating..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;