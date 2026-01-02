import React, { useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { QRCodeCanvas } from "qrcode.react";
import { Download, Printer, X, Award,Medal, ShieldCheck } from "lucide-react";
import "./CertificateTemplate.css";
import logoWatermark from "../../../assets/logo2.png";

export const CertificateTemplate = ({
  registration,
  onClose,
  directorName,
  instructorName,
}) => {
  const certificateRef = useRef(null);

  const verificationUrl = registration?.registration_number
    ? `${import.meta.env.VITE_FRONTEND_URL}/verify/${
        registration.registration_number
      }`
    : "";

  const handleDownloadPDF = async () => {
    const element = certificateRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("l", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, 297, 210);
    pdf.save(`Certificate_${registration.child_name.replace(/\s+/g, "_")}.pdf`);
  };

  const formalDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="cert-viewer-overlay">
      <div className="cert-top-bar">
        <button className="btn-exit" onClick={onClose}>
          <X size={18} /> Exit
        </button>
        <div className="btn-group">
          <button className="btn-download" onClick={handleDownloadPDF}>
            <Download size={18} /> PDF
          </button>
          <button className="btn-print" onClick={() => window.print()}>
            <Printer size={18} /> Print
          </button>
        </div>
      </div>

      <div className="certificate-paper" ref={certificateRef}>
        <div className="cert-outer-border">
          <div className="cert-inner-border">
            {/* Watermark */}
            <img src={logoWatermark} alt="" className="cert-watermark-logo" />

            <div className="cert-content">
              {/* TOP: Header */}
              <div className="cert-header">
                <Medal className="gold-icon" size={105} />
                <h1 className="academy-name">BRIGHT CODERS ACADEMY</h1>
                <div className="decorative-line"></div>
                <h2 className="cert-main-title">CERTIFICATE OF COMPLETION</h2>
                <p className="cert-subtitle">
                  This prestigious award is proudly presented to
                </p>
              </div>

              {/* MIDDLE: Student Info */}
              <div className="cert-body">
                <h3 className="student-name">
                  {registration?.child_name || "Recipient Name"}
                </h3>
                <p className="cert-description">
                  for successfully completing the course
                </p>
                <h4 className="course-name">
                  {registration?.course_name || "Course Name"}
                </h4>
              </div>

              {/* BOTTOM: Signatures, QR, and Seal */}
              <div className="cert-footer">
                <div className="sig-block">
                  <p className="handwritten-sig">{directorName}</p>
                  <div className="sig-line"></div>
                  <p className="sig-title">Program Director</p>
                </div>

                <div className="cert-meta">
                  <div className="cert-qr">
                    <QRCodeCanvas value={verificationUrl} size={65} level="H" />
                    <p className="qr-caption">SCAN TO VERIFY</p>
                  </div>
                  <div className="gold-seal">
                    <ShieldCheck size={28} />
                    <span>OFFICIAL</span>
                  </div>
                </div>

                <div className="sig-block">
                  <p className="handwritten-sig">{instructorName}</p>
                  <div className="sig-line"></div>
                  <p className="sig-title">Head of Instruction</p>
                </div>
              </div>

              <div className="date-bottom">Issued on {formalDate}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
