import { Plus, Trash2, Image as ImageIcon, CheckCircle, X } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import "./AddCourseForm.css";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const AddCourseForm = ({ onClose, refreshCourses, initialData }) => {
  const [loading, setLoading] = useState(false);
  const formEndRef = useRef(null);

  // Initialize state: Handling both snake_case (DB) and camelCase (JS)
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    category: initialData?.category || "",
    duration: initialData?.duration || "",
    price: initialData?.price || "",
    level: initialData?.level || "Beginner",
    imageUrl: initialData?.imageUrl || initialData?.image_url || "",
    isPublic: initialData?.isPublic ?? initialData?.is_public ?? false,
    focus: initialData?.focus || [""],
    requirements: initialData?.requirements || [""],
    description: {
      definition: initialData?.description?.definition || "",
      learningPoints: initialData?.description?.learningPoints || [""],
      outcome: initialData?.description?.outcome || "",
    },
  });

  // Smooth scroll to bottom when adding fields
  const scrollToBottom = () => {
    formEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
    setTimeout(scrollToBottom, 50);
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
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.data?.imageUrl) {
        setFormData((prev) => ({ ...prev, imageUrl: response.data.imageUrl }));
      }
    } catch (error) {
      alert("Upload failed. Check backend console.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (initialData) {
        await axiosInstance.put(
          API_PATHS.COURSES.UPDATE(initialData.id),
          formData
        );
      } else {
        await axiosInstance.post(API_PATHS.COURSES.CREATE, formData);
      }
      refreshCourses();
      onClose();
    } catch (error) {
      alert("Failed to save course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit} className="premium-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Course Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g. Scratch Coding"
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              placeholder="e.g. Young Coders"
            />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="KSh 3,000"
            />
          </div>
          <div className="form-group">
            <label>Duration</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="3 weeks"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Course Definition</label>
          <textarea
            name="definition"
            rows="3"
            value={formData.description.definition}
            onChange={handleDescriptionChange}
            placeholder="Describe the program..."
          />
        </div>

        <div className="form-grid-2">
          <div className="form-section">
            <label>Learning Points</label>
            {formData.description.learningPoints.map((item, index) => (
              <div key={index} className="array-item">
                <input
                  value={item}
                  placeholder="Skill learned..."
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
                  placeholder="e.g. Laptop"
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
            value={formData.description.outcome}
            onChange={handleDescriptionChange}
            placeholder="What will they achieve?"
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
            <span>{formData.imageUrl ? "Change Image" : "Upload Image"}</span>
            <input type="file" hidden onChange={handleFileUpload} />
          </label>
          {formData.imageUrl && (
            <div className="upload-status">
              <CheckCircle size={16} /> Uploaded
            </div>
          )}
        </div>

        <div ref={formEndRef} style={{ height: "1px" }} />

        <div className="form-actions sticky-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading
              ? "Processing..."
              : initialData
              ? "Update Program"
              : "Create Program"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourseForm;
