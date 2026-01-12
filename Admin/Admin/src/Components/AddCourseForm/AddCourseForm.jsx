import {
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle,
  X,
  Star,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import "./AddCourseForm.css";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import {
  validateCourseForm,
  cleanCourseData,
} from "../../helpers/courseValidation";

const AddCourseForm = ({
  onClose,
  refreshCourses,
  initialData,
  triggerToast,
}) => {
  const [loading, setLoading] = useState(false);
  const formEndRef = useRef(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    code: initialData?.code || "",
    title: initialData?.title || "",
    category: initialData?.category || "",
    duration: initialData?.duration || "",
    price: initialData?.price || "",
    level: initialData?.level || "Beginner",
    imageUrl: initialData?.imageUrl || initialData?.image_url || "",
    isPublic: initialData?.isPublic ?? initialData?.is_public ?? false,
    focus: initialData?.focus || [""],
    isFeatured: initialData?.isFeatured ?? initialData?.is_featured ?? false,
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

  useEffect(() => {
    if (!initialData && formData.title && !formData.code) {
      const initials = formData.title
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 6);

      setFormData((prev) => ({ ...prev, code: initials }));
    }
  }, [initialData, formData.title, formData.code]);

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
    const { isValid, errors: validationErrors } = validateCourseForm(formData);

    if (!isValid) {
      setErrors(validationErrors);
      // Scroll to the first error
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    try {
      setLoading(true);
      setErrors({}); // Clear previous errors
      // Clean the data (remove empty array items)
      const dataToSend = cleanCourseData(formData);
      if (initialData) {
        await axiosInstance.put(
          API_PATHS.COURSES.UPDATE(initialData.id),
          dataToSend
        );
      } else {
        await axiosInstance.post(API_PATHS.COURSES.CREATE, dataToSend);
      }
      refreshCourses();
      onClose();
    } catch (error) {
      const serverMessage = error.response?.data?.error;

      const simpleStatement =
        typeof serverMessage === "string"
          ? serverMessage
          : "Please check the form for errors and try again.";

      triggerToast(simpleStatement, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit} className="premium-form">
        {/* Header Toggles - Strategic improvement for quick status management */}
        <div className="status-toggles">
          <label
            className={`toggle-control ${
              formData.isFeatured ? "active-featured" : ""
            }`}
          >
            <input
              type="checkbox"
              
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              hidden
            />
            <Star
              size={18}
              strokeWidth={1.5}
              stroke={formData.isFeatured ? "#f59e0b" : "#999"} // orange gold or gray
              fill={formData.isFeatured ? "#f59e0b" : "none"} // fill the star if featured
            />

            <span>
              {formData.isFeatured ? "Featured Program" : "Set as Featured"}
            </span>
          </label>

          <label
            className={`toggle-control ${
              formData.isPublic ? "active-public" : ""
            }`}
          >
            <input
              type="checkbox"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
              hidden
            />
            {formData.isPublic ? <CheckCircle size={18} color="blue" /> : <X size={18} />}
            <span>
              {formData.isPublic ? "Visible to Public" : "Draft Mode"}
            </span>
          </label>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Course Code</label>
            <input
              type="text"
              name="code"
              className={errors.code ? "input-error" : ""}
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g. PY, WD, SC"
            />
            {errors.code && <span className="error-msg">{errors.code}</span>}
          </div>

          <div className="form-group">
            <label>Course Title</label>
            <input
              type="text"
              name="title"
              className={errors.title ? "input-error" : ""}
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Scratch Coding"
            />
            {errors.title && <span className="error-msg">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              className={errors.category ? "input-error" : ""}
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Young Coders"
            />
            {errors.category && (
              <span className="error-msg">{errors.category}</span>
            )}
          </div>

          <div className="form-group">
            <label>Price (KSh)</label>
            <input
              type="number"
              name="price"
              className={errors.price ? "input-error" : ""}
              value={formData.price}
              onChange={handleChange}
              placeholder="3000"
            />
            {errors.price && <span className="error-msg">{errors.price}</span>}
          </div>

          <div className="form-group">
            <label>Duration</label>
            <input
              type="text"
              name="duration"
              className={errors.duration ? "input-error" : ""}
              value={formData.duration}
              onChange={handleChange}
              placeholder="3 weeks"
            />
            {errors.duration && (
              <span className="error-msg">{errors.duration}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Course Definition (Short Summary)</label>
          <textarea
            name="definition"
            className={errors.definition ? "input-error" : ""}
            rows="3"
            value={formData.description.definition}
            onChange={handleDescriptionChange}
            placeholder="A brief overview of what this program is about..."
          />
          {errors.definition && (
            <span className="error-msg">{errors.definition}</span>
          )}
        </div>

        <div className="form-grid-2">
          {/* Learning Points Section */}
          <div className="form-section">
            <label>Learning Points</label>
            <div className="array-list">
              {formData.description.learningPoints.map((item, index) => (
                <div key={index} className="array-item">
                  <input
                    value={item}
                    placeholder="e.g. Master Logic Gates"
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
            </div>
            <button
              type="button"
              className="add-btn"
              onClick={() => addArrayField(null, "learningPoints")}
            >
              <Plus size={16} /> Add Point
            </button>
          </div>

          {/* Requirements Section */}
          <div className="form-section">
            <label>Requirements</label>
            <div className="array-list">
              {formData.requirements.map((item, index) => (
                <div key={index} className="array-item">
                  <input
                    value={item}
                    placeholder="e.g. Windows Laptop"
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
            </div>
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
            className={errors.outcome ? "input-error" : ""}
            value={formData.description.outcome}
            onChange={handleDescriptionChange}
            placeholder="e.g. Students will build a fully functional 2D game."
          />
          {errors.outcome && (
            <span className="error-msg">{errors.outcome}</span>
          )}
        </div>

        <div className="form-grid-2">
          {/* Focus Modules */}
          <div className="form-section">
            <label>Focus Modules</label>
            <div className="array-list">
              {formData.focus.map((item, index) => (
                <div key={index} className="array-item">
                  <input
                    value={item}
                    placeholder="Module topic..."
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

          <div className="form-section">
            <label>Difficulty Level</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className={`level-select ${errors.level ? "input-error" : ""}`}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Media Section */}
        <div
          className={`upload-section ${errors.imageUrl ? "error-border" : ""}`}
        >
          <label className="file-label">
            <ImageIcon size={20} />
            <span>
              {formData.imageUrl ? "Change Cover Image" : "Upload Cover Image"}
            </span>
            <input type="file" hidden onChange={handleFileUpload} />
          </label>
          {formData.imageUrl && (
            <div className="upload-status">
              <CheckCircle size={16} /> Image Linked
            </div>
          )}
        </div>

        <div ref={formEndRef} style={{ height: "20px" }} />

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
