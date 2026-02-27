import React, { useEffect, useState, useMemo } from "react";
import { CustomAlerts, Toast } from "../../helpers/CustomAlerts/CustomAlerts.jsx";
import {
  Trash2, Loader2, Mail, MailOpen, Reply, Search,
  CheckCircle, Inbox, ChevronLeft, ChevronRight, Eye
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import ContactViewModal from "./ContactViewModal.jsx";
import "./AdminContact.css";

const AdminContactManager = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState("total");
  const [isProcessingId, setIsProcessingId] = useState(null);
  
  // NEW FEATURES STATE
  const [viewingContact, setViewingContact] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: "", message: "", type: "danger", onConfirm: () => {} });
  const [toastConfig, setToastConfig] = useState({ show: false, message: "", type: "success" });

  const triggerToast = (message, type = "success") => {
    setToastConfig({ show: true, message, type });
    setTimeout(() => setToastConfig((prev) => ({ ...prev, show: false })), 4000);
  };

  useEffect(() => {
    fetchContacts();
    // REAL-TIME: If using Socket.io, you would listen here:
    // socket.on("newContact", (data) => setContacts(prev => [data, ...prev]));
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.CONTACTS.GET_ALL);
      setContacts(response.data);
    } catch (err) {
      triggerToast("Error fetching messages", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- BULK ACTIONS ---
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredData.map(c => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkDelete = () => {
    setAlertConfig({
      isOpen: true,
      title: "Bulk Delete?",
      message: `Are you sure you want to delete ${selectedIds.length} messages?`,
      type: "danger",
      onConfirm: async () => {
        setAlertConfig(p => ({ ...p, isOpen: false }));
        try {
          // Assuming backend supports bulk delete or loop
          await Promise.all(selectedIds.map(id => axiosInstance.delete(API_PATHS.CONTACTS.DELETE(id))));
          setContacts(prev => prev.filter(c => !selectedIds.includes(c.id)));
          setSelectedIds([]);
          triggerToast("Selected messages deleted");
        } catch (err) { triggerToast("Bulk delete failed", "error"); }
      }
    });
  };

  // --- LOGIC ---
  const filteredData = useMemo(() => {
    let result = contacts.filter(c => 
      c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filterMode !== "total") result = result.filter(c => c.status === filterMode);
    return result;
  }, [contacts, searchTerm, filterMode]);

  // PAGINATION CALCULATION
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setIsProcessingId(id);

      await axiosInstance.patch(API_PATHS.CONTACTS.UPDATE_STATUS(id), { status: newStatus });
      setContacts(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
      triggerToast(`Marked as ${newStatus}`);
    } catch (error) { triggerToast("Update failed", "error"); }
    finally { setIsProcessingId(null); }
  };

  const handleViewContact = async (contact) => {
    if (!contact) return;
  setViewingContact(contact);

  // Only update if currently unread
  if (contact.status === "unread") {
    try {
        console.log(API_PATHS.CONTACTS.UPDATE_STATUS(contact.id));
      await axiosInstance.patch(
        API_PATHS.CONTACTS.UPDATE_STATUS(contact.id),
        { status: "read" }
      );

      setContacts(prev =>
        prev.map(c =>
          c.id === contact.id ? { ...c, status: "read" } : c
        )
      );
    } catch (error) {
        console.error("Backend Error:", error.response?.data);
    //   triggerToast("Failed to mark as read", "error");
    triggerToast("Failed to mark as read: " + (error.response?.data?.message || "Forbidden"), "error");
    }
  }
};

  return (
    <>
      <div className="admin-container">
        <div className="stats-grid">
          <div className={`stat-card ${filterMode === "total" ? "active-filter" : ""}`} onClick={() => {setFilterMode("total"); setCurrentPage(1);}}>
            <div className="stat-icon total"><Inbox size={20} /></div>
            <div className="stat-info"><span className="stat-label">Total</span><span className="stat-value">{contacts.length}</span></div>
          </div>
          <div className={`stat-card ${filterMode === "unread" ? "active-filter" : ""}`} onClick={() => {setFilterMode("unread"); setCurrentPage(1);}}>
            <div className="stat-icon draft"><Mail size={20} /></div>
            <div className="stat-info"><span className="stat-label">Unread</span><span className="stat-value">{contacts.filter(c=>c.status==='unread').length}</span></div>
          </div>
        </div>

        <div className="admin-header">
          <div>
             <h1>Contact Inquiries</h1>
            <p className="subtitle">Manage messages from potential students and partners</p>
            {selectedIds.length > 0 && (
              <button className="delete-btn bulk-btn" onClick={handleBulkDelete}>
                <Trash2 size={16} /> Delete Selected ({selectedIds.length})
              </button>
            )}
          </div>
          <div className="header-actions">
            <div className="search-container">
              <Search className="search-icon" size={18} />
              <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-full-state"><Loader2 className="spinner" size={40} /><p>Loading...</p></div>
        ) : (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: "5%" }} ><input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === filteredData.length && filteredData.length > 0} /></th>
                  <th>Sender</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((c) => (
                  <tr key={c.id} className={`${selectedIds.includes(c.id) ? "selected-row" : ""} ${c.status === "unread" ? "unread-row" : ""}`}>
                    <td><input type="checkbox" checked={selectedIds.includes(c.id)} onChange={() => handleSelectOne(c.id)} /></td>
                    <td>
                      <div className="font-bold">{c.full_name}</div>
                      <div className="text-muted small">{c.email}</div>
                    </td>
                    <td className="message-cell" onClick={() => handleViewContact(c)}>
                      <p className="truncate-text pointer">{c.message}</p>
                    </td>
                    <td><span className={`badge ${c.status}`}>{c.status}</span></td>
                    <td>
                      <div className="action-btns">
                        <button className="edit-btn" title="View" onClick={() => handleViewContact(c)}><Eye size={16} /></button>
                        <a href={`mailto:${c.email}`} className="push-row-btn" title="Quick Reply"><Reply size={16} /></a>
                        <button className="delete-btn" onClick={() => handleUpdateStatus(c.id, 'replied')}><CheckCircle size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PAGINATION CONTROLS */}
            <div className="pagination-footer">
              <span>Showing {paginatedData.length} of {filteredData.length}</span>
              <div className="pagination-btns">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}><ChevronLeft size={20} /></button>
                <span className="page-number">Page {currentPage} of {totalPages}</span>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}><ChevronRight size={20} /></button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ContactViewModal contact={viewingContact} onClose={() => setViewingContact(null)} />
      
      <CustomAlerts isOpen={alertConfig.isOpen} title={alertConfig.title} message={alertConfig.message} type={alertConfig.type} onConfirm={alertConfig.onConfirm} onCancel={() => setAlertConfig(p => ({ ...p, isOpen: false }))} />
      {toastConfig.show && <Toast message={toastConfig.message} type={toastConfig.type} onClose={() => setToastConfig(p => ({ ...p, show: false }))} />}
    </>
  );
};

export default AdminContactManager;