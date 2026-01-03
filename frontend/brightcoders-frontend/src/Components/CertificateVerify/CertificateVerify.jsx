import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShieldCheck, ShieldX, Loader2, Search } from "lucide-react";
import "./CertificateVerify.css";

const CertificateVerify = () => {
  const { regNumber } = useParams(); // Grabs the ID from the URL
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Function to handle the actual API call
  const performVerification = async (id) => {
    if (!id || id === ":regNumber") return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/registration/verify/${id}`
      );
      setResult(res.data.data);
    } catch (err) {
      // --- ADDED SECURE ERROR HANDLING HERE ---
      if (err.response?.status === 429) {
        setError(
          "Too many attempts. Please wait 15 minutes before trying again."
        );
      } else if (err.response?.status === 404) {
        setError(
          "Invalid Registration ID. Please check the number and try again."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "An error occurred during verification."
        );
      }
      // ------------------------------------------
    } finally {
      setLoading(false);
    }
  };

  // Trigger verification if regNumber is in the URL (QR Code scan)
  useEffect(() => {
    if (regNumber && regNumber !== ":regNumber") {
      performVerification(regNumber);
    }
  }, [regNumber]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/verify/${searchInput.trim()}`);
    }
  };

  // VIEW 1: Loading State
  if (loading) {
    return (
      <div className="verify-page">
        <div className="verify-card loading">
          <Loader2 className="spin" size={48} />
          <p>Validating Credentials...</p>
        </div>
      </div>
    );
  }

  // VIEW 2: Success State (Certificate Found)
  if (result) {
    return (
      <div className="verify-page">
        <div className="verify-card success-card">
          <ShieldCheck size={80} color="#10b981" />
          <h1>Authenticity Confirmed</h1>
          <div className="data-grid">
            <div className="data-item">
              <span>Student Name</span>
              <strong>{result.studentName}</strong>
            </div>
            <div className="data-item">
              <span>Course</span>
              <strong>{result.courseName}</strong>
            </div>
            <div className="data-item">
              <span>Completion Date</span>
              <strong>{new Date(result.issuedAt).toLocaleDateString()}</strong>
            </div>
            <div className="data-item">
              <span>Registration ID</span>
              <strong>{regNumber}</strong>
            </div>
          </div>
          <button
            className="btn-reset"
            onClick={() => {
              setResult(null);
              navigate("/verify");
            }}
          >
            Verify Another
          </button>
        </div>
      </div>
    );
  }

  // VIEW 3: Search/Initial State (or Error)
  return (
    <div className="verify-page">
      <div className="verify-card search-card">
        {error ? (
          <ShieldX size={60} color="#ef4444" />
        ) : (
          <Search size={60} color="#3b82f6" />
        )}
        <h2>Verify Certificate</h2>
        <p>Enter the student registration number to verify its authenticity.</p>

        <form onSubmit={handleSearchSubmit} className="search-box">
          <input
            type="text"
            placeholder="e.g. BC-26-PY-001"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" disabled={loading || searchInput.length < 5}>
            {loading ? "Validating..." : "Check Now"}
          </button>
        </form>

        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
};

export default CertificateVerify;
