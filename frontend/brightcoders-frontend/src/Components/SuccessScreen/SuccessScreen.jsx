import React from "react";
import {
  FaCheck,
  FaEnvelopeOpenText,
  FaDownload,
  FaWhatsapp,
  FaHome,
  FaSearchDollar,
  FaClock,
} from "react-icons/fa";
import { jsPDF } from "jspdf";
import logo from "../../assets/logo2.png";
import "./SuccessScreen.css";

const SuccessScreen = ({ formData, mpesaCode, isPayLater }) => {
  const handleDownloadReceipt = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // 1. LOGO
    try {
      doc.addImage(logo, "PNG", 15, 10, 25, 25);
    } catch (e) {
      console.warn("Logo failed", e);
    }

    // 2. WATERMARK
    try {
      const watermarkSize = 80;
      const vPos = pageHeight * 0.4;
      doc.saveGraphicsState();
      if (doc.GState) {
        doc.setGState(new doc.GState({ opacity: 0.06 }));
      }
      doc.addImage(
        logo,
        "PNG",
        (pageWidth - watermarkSize) / 2,
        vPos - watermarkSize / 2,
        watermarkSize,
        watermarkSize
      );
      doc.restoreGraphicsState();
    } catch (e) {
      console.warn("Watermark failed", e);
    }

    // 3. HEADER TEXT (Dynamic Title)
    doc.setFontSize(22);
    doc.setTextColor(44, 62, 80);
    // Change Title based on status
    const mainTitle = isPayLater ? "REGISTRATION SUMMARY" : "OFFICIAL RECEIPT";
    doc.text(mainTitle, 105, 25, { align: "center" });

    doc.setFontSize(10);
    doc.text("Bright Coders Academy | info@brightcoders.com", 105, 32, {
      align: "center",
    });
    doc.line(15, 40, 195, 40);

    // 4. DATA SECTION
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text(`Date: ${date}`, 20, 50);
    doc.text(`Reg No: ${formData.regNumber || "N/A"}`, 140, 50);

    // 5. STATUS BOX (Dynamic Color)
    if (isPayLater) {
      doc.setTextColor(230, 126, 34); // Orange for Pending
      doc.text(`PAYMENT STATUS: PENDING`, 20, 60);
      doc.setFont(undefined, "normal");
      doc.setFontSize(10);
      doc.text(`(Balance to be cleared before class commencement)`, 20, 66);
    } else {
      doc.setTextColor(46, 204, 113); // Green for Paid
      doc.text(`PAYMENT STATUS: PAID`, 20, 60);
      doc.setTextColor(44, 62, 80);
      doc.setFont(undefined, "normal");
      doc.text(`M-Pesa Transaction: ${mpesaCode}`, 20, 68);
    }

    // 6. BODY DETAILS
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.setFont(undefined, "bold");
    doc.text("Enrolment Details:", 20, 80);
    doc.setFont(undefined, "normal");
    doc.text(`Parent Name: ${formData.parentName}`, 20, 90);
    doc.text(`Student Name: ${formData.childName}`, 20, 98);
    doc.text(`Course: ${formData.course}`, 20, 106);
    doc.text(`Schedule: ${formData.preferredTime}`, 20, 114);

    // 7. FOOTER
    doc.line(15, 130, 195, 130);
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(
      "This is a computer-generated document. No signature required.",
      105,
      140,
      { align: "center" }
    );

    const fileName = isPayLater ? "Summary" : "Receipt";
    doc.save(`BrightCoders_${fileName}_${formData.childName}.pdf`);
  };

  return (
    <div className="wizard-card success-card fade-in text-center">
      <div className="success-icon-wrapper">
        <FaCheck className="success-check-icon" />
      </div>

      <h2>{isPayLater ? "Slot Reserved!" : "Registration Complete!"}</h2>

      <p className="success-msg">
        Thank you, <strong>{formData.parentName}</strong>.
        {isPayLater
          ? " We've reserved a spot for "
          : " We've received the enrolment for "}
        <strong>{formData.childName}</strong> (ID: {formData.regNumber}) for the{" "}
        <strong>{formData.course}</strong> course.
      </p>

      <div className="next-steps-box">
        <h3>What happens next?</h3>
        <ul className="success-list">
          {isPayLater ? (
            <li>
              <FaClock className="icon-verify" style={{ color: "#f39c12" }} />
              <span>
                Our admissions team will contact you to{" "}
                <strong>finalize payment</strong>.
              </span>
            </li>
          ) : (
            <li>
              <FaSearchDollar className="icon-verify" />
              <span>
                We are verifying your M-Pesa code: <strong>{mpesaCode}</strong>.
              </span>
            </li>
          )}

          <li>
            <FaEnvelopeOpenText className="icon-email" />
            <span>
              A confirmation will be sent to{" "}
              <strong>{formData.parentEmail}</strong>.
            </span>
          </li>
          <li>
            <FaWhatsapp className="icon-whatsapp" />
            <span>
              We'll WhatsApp you shortly with the class joining links.
            </span>
          </li>
        </ul>
      </div>

      <div className="button-group">
        <button className="download-btn" onClick={handleDownloadReceipt}>
          <FaDownload /> {isPayLater ? "Download Summary" : "Download Receipt"}
        </button>

        <button
          className="submit-btn"
          onClick={() => (window.location.href = "/")}
        >
          <FaHome /> Back to Home
        </button>
      </div>
    </div>
  );
};

export default SuccessScreen;
