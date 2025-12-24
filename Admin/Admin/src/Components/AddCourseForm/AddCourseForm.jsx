import { Plus, Trash2, Image as ImageIcon, CheckCircle } from "lucide-react";
import React, { useState } from "react";
import "./AddCourseForm.css";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const AddCourseForm = ({ onClose, refreshCourses }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    duration: "",
    price: "",
    level: "Beginner",
    imageUrl: "",
    isPublic: false,
    focus: [""],
    requirements: [""],
    description: {
      definition: "",
      learningPoints: [""],
      outcome: "",
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDescriptionChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      description: { ...prev.description, [name]: value },
    }));
  };

  const handleArrayChange = (index, value, field, subField = null) => {
    if (subField) {
      const newArray = [...formData.description[subField]];
      newArray[index] = value;
      setFormData((prev) => ({
        ...prev,
        description: { ...prev.description, [subField]: newArray },
      }));
    } else {
      const newArray = [...formData[field]];
      newArray[index] = value;
      setFormData((prev) => ({ ...prev, [field]: newArray }));
    }
  };

  const addArrayField = (field, subField = null) => {
    if (subField) {
      setFormData((prev) => ({
        ...prev,
        description: {
          ...prev.description,
          [subField]: [...prev.description[subField], ""],
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
    }
  };

  const removeArrayField = (index, field, subField = null) => {
    if (subField) {
      const newArray = formData.description[subField].filter(
        (_, i) => i !== index
      );
      setFormData((prev) => ({
        ...prev,
        description: { ...prev.description, [subField]: newArray },
      }));
    } else {
      const newArray = formData[field].filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, [field]: newArray }));
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const uploadData = new FormData();
    uploadData.append("image", file);
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        API_PATHS.IMAGE.UPLOAD_IMAGE,
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Force the correct header
          },
        }
      );
      if (response.data?.imageUrl) {
        setFormData((prev) => ({ ...prev, imageUrl: response.data.imageUrl }));
      }
    } catch (error) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axiosInstance.post(API_PATHS.COURSES.CREATE, formData);
      refreshCourses();
      onClose();
    } catch (error) {
      alert("Failed to save course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="premium-form">
        

        <div className="form-grid">
          <div className="form-group">
            <label>Course Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Scratch Coding"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              placeholder="e.g. Young Coders"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              type="text"
              name="price"
              placeholder="KSh 3,000"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Duration</label>
            <input
              type="text"
              name="duration"
              placeholder="3 weeks"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Course Definition</label>
          <textarea
            name="definition"
            rows="3"
            placeholder="Describe the program..."
            onChange={handleDescriptionChange}
          />
        </div>

        <div className="form-grid-2">
          <div className="form-section">
            <label>Learning Points</label>
            {formData.description.learningPoints.map((item, index) => (
              <div key={index} className="array-item">
                <input
                  value={item}
                  placeholder="What will they learn?"
                  onChange={(e) =>
                    handleArrayChange(
                      index,
                      e.target.value,
                      null,
                      "learningPoints"
                    )
                  }
                />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() =>
                    removeArrayField(index, null, "learningPoints")
                  }
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="add-btn"
              onClick={() => addArrayField(null, "learningPoints")}
            >
              <Plus size={16} /> Add Point
            </button>
          </div>

          <div className="form-section">
            <label>Requirements</label>
            {formData.requirements.map((item, index) => (
              <div key={index} className="array-item">
                <input
                  value={item}
                  placeholder="e.g. A laptop"
                  onChange={(e) =>
                    handleArrayChange(index, e.target.value, "requirements")
                  }
                />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeArrayField(index, "requirements")}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="add-btn"
              onClick={() => addArrayField("requirements")}
            >
              <Plus size={16} /> Add Requirement
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Final Outcome</label>
          <input
            type="text"
            name="outcome"
            placeholder="By the end, students will..."
            onChange={handleDescriptionChange}
          />
        </div>

        <div className="form-group">
          <label>Focus Modules</label>
          <div className="focus-grid">
            {formData.focus.map((item, index) => (
              <div key={index} className="array-item">
                <input
                  value={item}
                  onChange={(e) =>
                    handleArrayChange(index, e.target.value, "focus")
                  }
                />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeArrayField(index, "focus")}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="add-btn"
            onClick={() => addArrayField("focus")}
          >
            <Plus size={16} /> Add Focus
          </button>
        </div>

        <div className="upload-section">
          <label className="file-label">
            <ImageIcon size={20} />
            <span>
              {formData.imageUrl ? "Change Image" : "Upload Course Image"}
            </span>
            <input type="file" hidden onChange={handleFileUpload} />
          </label>
          {formData.imageUrl && (
            <div className="upload-status">
              <CheckCircle size={16} /> Uploaded
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Create Program"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourseForm;
