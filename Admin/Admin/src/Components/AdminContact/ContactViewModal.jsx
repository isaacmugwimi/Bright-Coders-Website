import React from "react";
import { X, Mail, Calendar, MessageSquare, Copy, ExternalLink } from "lucide-react";
import "./AdminContact.css";

const ContactViewModal = ({ contact, onClose, triggerToast }) => {
  if (!contact) return null;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    if (triggerToast) triggerToast("Email copied!", "success");
  };

  const formattedDate = new Date(contact.created_at).toLocaleDateString(undefined, { 
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' 
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="contact-view-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="view-modal-header">
          <div className="header-user-info">
            <div className="user-avatar">
              {contact.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{contact.full_name}</h3>
              <span className={`status-pill ${contact.status}`}>{contact.status}</span>
            </div>
          </div>
          <button className="close-circle-btn" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
            <X size={24} />
          </button>
        </div>

        <div className="view-modal-body">
          {/* Quick Info */}
          <div className="info-grid">
            <div className="info-item">
              <label className="section-label"><Mail size={12} /> Email</label>
              <div className="info-value-group">
                <span style={{ fontSize: '14px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {contact.email}
                </span>
                <button className="icon-only-btn" onClick={() => copyToClipboard(contact.email)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#6366f1' }}>
                  <Copy size={14} />
                </button>
              </div>
            </div>
            <div className="info-item">
              <label className="section-label"><Calendar size={12} /> Received</label>
              <div className="info-value-group">
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="message-container">
            <label className="section-label"><MessageSquare size={12} /> Message Content</label>
            <div className="message-content-box">
              {contact.message}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="view-modal-footer">
          <button className="secondary-btn" onClick={onClose} style={{ background: 'transparent', border: 'none', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
            Close
          </button>
          <a href={`mailto:${contact.email}?subject=Re: Inquiry`} className="primary-reply-btn">
            <ExternalLink size={16} />
            Reply via Email
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactViewModal;