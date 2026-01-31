import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  ShieldCheck,
  Lock,
  AlertTriangle,
  RefreshCcw,
  EyeOff,
  Eye,
} from "lucide-react";
import UserContext from "../../Components/Context/UserContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
// import user_pic from "../../assets/user.svg";
import upload from "../../assets/upload.svg";
import delete_icon from "../../assets/trash-2.svg";
import "./AccountSettings.css";
import uploadImage from "../../utils/uploadImage";
import { CustomAlerts, Toast } from "../../helpers/CustomAlerts/CustomAlerts";

const AccountSettings = () => {
  const { user, updateUser, logout } = useContext(UserContext);
  const navigate = useNavigate();
  // const fileInputRef = useRef(null);
  const hasChecked = useRef(false); // Prevents double OTP on mount

  const [isVerified, setIsVerified] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [deletePassword, setDeletePassword] = useState("");

  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "danger",
    onConfirm: () => {},
  });

  const [toastConfig, setToastConfig] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const triggerToast = (message, type = "success") => {
    setToastConfig({ show: true, message, type });
    setTimeout(
      () => setToastConfig((prev) => ({ ...prev, show: false })),
      4000,
    );
  };

  // State to store the uploaded image
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    profile_image_url: user?.profile_image_url || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    const initSecurity = async () => {
      try {
        await axiosInstance.get(API_PATHS.ADMIN_ACCOUNT.GET_PROFILE);
        setIsVerified(true);
      } catch (err) {
        if (err.response?.status === 403) {
          try {
            await axiosInstance.post(API_PATHS.ADMIN_ACCOUNT.REQUEST_OTP);
            setIsVerified(false);
          } catch (otpErr) {
            triggerToast("Failed to trigger security code.", "error");
            setMessage({
              type: "error",
              text: "Failed to trigger security code.",
            });
          }
        }
      } finally {
        setVerifying(false);
      }
    };
    initSecurity();
  }, []);
  const getInitials = (name) => {
    if (!name) return "AD";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };



  // This closes the modal and resets the password field
const closeAlert = () => {
  setAlertConfig((prev) => ({ ...prev, isOpen: false }));
  setDeletePassword(""); // Clear password for security
};

// This is the actual logic that runs when you click the "Confirm" button in the modal
const handleDeleteConfirm = async () => {
  if (!deletePassword) {
    triggerToast("Password is required to authenticate destruction.", "error");
    return;
  }

  setLoading(true);
  try {
    await axiosInstance.delete(API_PATHS.ADMIN_ACCOUNT.DELETE_ACCOUNT, {
      data: { password: deletePassword },
    });

    closeAlert();
    triggerToast("Identity permanently removed.", "success");

    setTimeout(() => {
      logout?.();
      navigate("/authentication");
    }, 1500);
  } catch (err) {
    triggerToast(
      err.response?.data?.message || "Purge failed. Verify credentials.",
      "error"
    );
    if (err.response?.status === 403) {
      setIsVerified(false);
    }
  } finally {
    setLoading(false);
  }
};

  const handleVerifyStepUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      await axiosInstance.post(API_PATHS.ADMIN_ACCOUNT.VERIFY_OTP, { otp });
      setIsVerified(true);

      setMessage({ type: "success", text: "Access granted." });
      triggerToast("Access granted.", "success");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Invalid code. Access denied.";
      setMessage({ type: "error", text: errorMsg });
      triggerToast(errorMsg, "error");
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    let finalImageUrl = profileData.profile_image_url;
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // upload image if present
      if (profilePicFile) {
        const imageUploadResponse = await uploadImage(profilePicFile);
        finalImageUrl = imageUploadResponse.imageUrl || imageUploadResponse.url;
      }

      await axiosInstance.put(API_PATHS.ADMIN_ACCOUNT.UPDATE_PROFILE, {
        username: profileData.full_name,
        profile_image_url: finalImageUrl,
      });
      updateUser({
        ...user,
        full_name: profileData.full_name,
        profile_image_url: finalImageUrl,
      });
      setMessage({ type: "success", text: "Identity updated successfully." });
      triggerToast("Identity updated successfully.", "success");
    } catch (err) {
      // CHECK FOR 403 HERE
      if (err.response?.status === 403) {
        triggerToast("Security session expired. Please re-verify.", "error");
        setMessage({
          type: "error",
          text: "Security session expired. Please re-verify.",
        });

        // Re-trigger OTP request
        try {
          await axiosInstance.post(API_PATHS.ADMIN_ACCOUNT.REQUEST_OTP);
          setIsVerified(false); // This brings back the OTP screen
        } catch (otpErr) {
          triggerToast("Failed to send new security code.", "error");
          setMessage({
            type: "error",
            text: "Failed to send new security code.",
          });
        }
      } else {
        triggerToast("Update failed. Check your connection.", "error");
        setMessage({
          type: "error",
          text: "Update failed. Check your connection.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      triggerToast("Passwords do not match.", "error");
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.put(API_PATHS.ADMIN_ACCOUNT.CHANGE_PASSWORD, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      if (
        window.confirm(
          "Credentials rolled. System restart required. Re-login now?",
        )
      ) {
        if (logout) logout();
        navigate("/authentication");
      } else {
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      triggerToast(
        err.response?.data?.message || "Credential update failed.",
        "error",
      );
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Credential update failed.",
      });
    } finally {
      setLoading(false);
    }
  };

//   const handleDeleteAccount = () => {
//   setAlertConfig({
//     isOpen: true,
//     title: "Decommission Account?",
//     message: "Enter your password to permanently delete this account.",
//     type: "danger",
//     onConfirm: async () => {
//       if (!deletePassword) {
//         triggerToast("Password is required.", "error");
//         return;
//       }

//       setAlertConfig((prev) => ({ ...prev, isOpen: false }));
//       setLoading(true);

//       try {
//         await axiosInstance.delete(
//           API_PATHS.ADMIN_ACCOUNT.DELETE_ACCOUNT,
//           {
//             data: { password: deletePassword },
//           }
//         );

//         triggerToast("Identity permanently removed.", "success");

//         setTimeout(() => {
//           logout?.();
//           navigate("/authentication");
//         }, 1500);
//       } catch (err) {
//         triggerToast(
//           err.response?.data?.message || "Deletion failed.",
//           "error"
//         );

//         if (err.response?.status === 403) {
//           setIsVerified(false);
//         }
//       } finally {
//         setLoading(false);
//         setDeletePassword("");
//       }
//     },
//   });
// };


const handleDeleteAccount = () => {
  setAlertConfig({
    isOpen: true,
    title: "Decommission Account?",
    message: "This action is irreversible. Enter your passphrase to proceed.",
    type: "danger",
  });
};

  const toggleVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleDeleteProfilePic = (e) => {
    e.preventDefault();
    setProfilePicFile(null);
    setProfilePicPreview(null);
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file); // store actual file for upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result); // base64 string for preview
      };
      reader.readAsDataURL(file);
    }
  };

  if (verifying)
    return (
      <div className="admin-account-loader">
        Establishing Encrypted Tunnel...
      </div>
    );

  if (!isVerified) {
    return (
      <div className="admin-stepup-overlay">
        <div className="admin-stepup-card animate-fade-in">
          <div className="admin-stepup-icon">
            <ShieldCheck size={48} color="#2563eb" />
          </div>
          <h2>Confirm Identity</h2>
          <p>
            Enter the code sent to <strong>{user?.email}</strong>
          </p>

          <form onSubmit={handleVerifyStepUp}>
            <input
              type="text"
              className={`admin-stepup-input ${message.type === "error" ? "has-error" : ""}`}
              placeholder="000000"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <div className="admin-stepup-actions">
              <button
                type="submit"
                className="admin-account-btn admin-account-btn-primary"
                disabled={loading}
              >
                {loading ? "Decrypting..." : "Verify & Unlock"}
              </button>

              <button
                type="button"
                className="admin-account-btn admin-account-btn-ghost"
                onClick={() => navigate("/home")}
                disabled={loading}
              >
                Cancel & Return
              </button>
            </div>
          </form>

          {message.text && (
            <div className={`otp-feedback is-${message.type}`}>
              <AlertTriangle size={16} /> {message.text}
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="admin-account-container animate-fade-in">
        <header className="admin-account-header">
          <div className="header-flex">
            <div>
              <h1 className="admin-account-title">Master Control</h1>
              <p className="admin-account-subtitle">
                Identity Verified: {user?.email}
              </p>
            </div>
            <div className="security-badge">
              <Lock size={14} /> Session Encrypted
            </div>
          </div>
        </header>

        {message.text && (
          <div className={`admin-account-alert is-${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="admin-account-main-grid">
          {/* Profile Section */}
          <section className="admin-account-panel">
            <h3 className="admin-account-panel-title">
              Administrative Identity
            </h3>
            <div className="admin-account-avatar-wrapper">
              <div className="profile-pic-section">
                <label
                  htmlFor="profile-pic-upload"
                  className="placeholder-circle"
                >
                  {profilePicPreview ? (
                    <img
                      src={profilePicPreview}
                      alt="Profile Preview"
                      className="profile-pic-preview"
                      onError={(e) => {
                        e.target.onerror = null;
                        setProfilePicPreview(null);
                      }}
                    />
                  ) : (
                    <div className="avatar-initials">
                      {getInitials(profileData.full_name)}
                    </div>
                  )}

                  <div
                    className="upload-icon"
                    onClick={
                      profilePicPreview ? handleDeleteProfilePic : undefined
                    }
                    style={{ background: profilePicPreview ? "#ff4d4d" : "" }}
                  >
                    <img
                      src={profilePicPreview ? delete_icon : upload}
                      alt={profilePicPreview ? "Delete" : "Upload"}
                    />
                  </div>
                </label>
                <input
                  id="profile-pic-upload"
                  type="file"
                  accept="image/*"
                  className="profile-pic-input"
                  onChange={handleProfilePicChange}
                  style={{ display: "none" }}
                />
              </div>{" "}
            </div>

            <form onSubmit={handleUpdateProfile} className="admin-account-form">
              <div className="admin-account-field">
                <label className="admin-account-label">Full Legal Name</label>
                <input
                  className="admin-account-input"
                  type="text"
                  value={profileData.full_name}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      full_name: e.target.value,
                    })
                  }
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="admin-account-btn admin-account-btn-primary"
              >
                {loading ? "Syncing..." : "Save Identity"}
              </button>
            </form>
          </section>

          {/* Password Section */}
          <section className="admin-account-panel">
            <h3 className="admin-account-panel-title">
              Cryptographic Credentials
            </h3>
            <form
              onSubmit={handleUpdatePassword}
              className="admin-account-form"
            >
              {/* Current Password */}
              <div className="admin-account-field">
                <label className="admin-account-label">
                  Current Passphrase
                </label>
                <div className="password-input-wrapper">
                  <input
                    className="admin-account-input"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-icon"
                    onClick={() => toggleVisibility("current")}
                  >
                    {showPasswords.current ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="admin-account-field">
                <label className="admin-account-label">New Passphrase</label>
                <div className="password-input-wrapper">
                  <input
                    className="admin-account-input"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-icon"
                    onClick={() => toggleVisibility("new")}
                  >
                    {showPasswords.new ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="admin-account-field">
                <label className="admin-account-label">
                  Verify New Passphrase
                </label>
                <div className="password-input-wrapper">
                  <input
                    className="admin-account-input"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-icon"
                    onClick={() => toggleVisibility("confirm")}
                  >
                    {showPasswords.confirm ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="admin-account-btn admin-account-btn-outline"
              >
                {loading ? (
                  "Rolling..."
                ) : (
                  <>
                    <RefreshCcw size={16} /> Roll Keys & Restart
                  </>
                )}
              </button>
            </form>
          </section>

          <section className="admin-account-panel admin-account-panel-danger">
            <h3 className="admin-account-panel-title">Decommission</h3>

            <p className="admin-account-warning-text">
              Permanently purge this administrative identity from the system.
            </p>

            <button
              className="admin-account-btn admin-account-btn-danger"
              onClick={handleDeleteAccount}
              disabled={loading}
            >
              Destroy Identity
            </button>
          </section>
        </div>
      </div>

      <CustomAlerts
  isOpen={alertConfig.isOpen}
  title="Decommission Account?"
  message="This action is permanent."
  type="danger"
  onConfirm={handleDeleteConfirm}
  onCancel={closeAlert}
>
  <input
    type="password"
    placeholder="Enter your password"
    value={deletePassword}
    onChange={(e) => setDeletePassword(e.target.value)}
    className="alert-password-input"
  />
</CustomAlerts>


      {toastConfig.show && (
        <Toast
          message={toastConfig.message}
          type={toastConfig.type}
          onClose={() => setToastConfig((prev) => ({ ...prev, show: false }))}
        />
      )}
    </>
  );
};

export default AccountSettings;
