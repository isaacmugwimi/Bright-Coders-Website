import { jsPDF } from "jspdf";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateAndSaveReceipt = async (studentData) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString("en-GB");
  const pageWidth = 210;

  // --- 1. DATA MAPPING (Matches Queries.js Schema) ---
  // Ensure we use the exact column names from your PostgreSQL queries
  const totalFee = Number(studentData.total_course_price) || 0;
  const amountPaid = Number(studentData.amount_paid) || 0;
  const balance = Number(studentData.balance_due || totalFee - amountPaid);

  // --- 2. FLEXIBLE STATUS LOGIC ---
  let statusText = "PARTIAL PAYMENT";
  let STAMP_COLOR = [218, 165, 32]; // Gold/Yellow

  // Fix: Only mark "Fully Paid" if a fee exists and is covered
  if (totalFee > 0 && amountPaid >= totalFee) {
    statusText = "FULLY PAID";
    STAMP_COLOR = [34, 197, 94]; // Success Green
  } else if (amountPaid === 0) {
    statusText = "UNPAID / QUOTE";
    STAMP_COLOR = [239, 68, 68]; // Danger Red
  }

  const dir = "./receipts";
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  // --- 3. COLORS & WATERMARK ---
  const PRIMARY_BLUE = [37, 99, 235];
  const TEXT_DARK = [30, 41, 59];

  doc.saveGraphicsState();
  doc.setGState(new doc.GState({ opacity: 0.1 }));
  doc.setFont("helvetica", "bold").setFontSize(45).setTextColor(200);
  doc.text("BRIGHT CODERS ACADEMY", pageWidth / 2, 150, {
    align: "center",
    angle: 45,
  });
  doc.restoreGraphicsState();

  // --- 4. HEADER ---
  doc.setFillColor(...PRIMARY_BLUE).rect(0, 0, pageWidth, 72, "F");

  try {
    const logoPath = path.join(__dirname, "../assets/logo2.png");
    if (fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      doc.addImage(logoBuffer, "PNG", (pageWidth - 40) / 2, 8, 40, 40);
    }
  } catch (err) {
    console.error("Logo missing:", err.message);
  }

  doc.setTextColor(255).setFontSize(22).setFont("helvetica", "bold");
  doc.text("BRIGHT CODERS ACADEMY", pageWidth / 2, 62, { align: "center" });

  // --- 5. RECEIPT HEADERS ---
  doc
    .setTextColor(...TEXT_DARK)
    .setFontSize(18)
    .text("OFFICIAL RECEIPT", 15, 82);
  doc.setFontSize(10).setFont("helvetica", "normal");
  doc.text(`Receipt No: ${studentData.registration_number}`, 15, 89);
  doc.text(`Date: ${date}`, pageWidth - 15, 89, { align: "right" });

  // --- 6. INFO BOX ---
  doc.setFillColor(248, 250, 252).rect(15, 98, 180, 95, "F");
  doc
    .setFontSize(12)
    .setFont("helvetica", "bold")
    .text("PAYMENT BREAKDOWN", 25, 108);
  doc.setDrawColor(...PRIMARY_BLUE).line(25, 110, 80, 110);

  let yPos = 122;
  const rows = [
    ["Student Name:", studentData.child_name || studentData.parent_name], //
    ["Course:", studentData.course_name], //
    ["M-Pesa Code:", studentData.mpesa_code || "N/A"], //
    ["Total Fee:", `Ksh ${totalFee.toLocaleString()}`],
    ["Paid To Date:", `Ksh ${amountPaid.toLocaleString()}`],
  ];

  rows.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold").text(label, 30, yPos);
    doc.setFont("helvetica", "normal").text(String(value), 85, yPos);
    yPos += 10;
  });

  // --- 7. DYNAMIC BALANCE SECTION ---
  yPos += 2;
  doc.setDrawColor(220).line(30, yPos - 5, 180, yPos - 5);

  if (totalFee <= 0) {
    // Alert admin if the fee wasn't passed correctly
    doc.setTextColor(239, 68, 68).setFont("helvetica", "bold");
    doc.text("NOTICE:", 30, yPos);
    doc.text("Total Fee missing in database record.", 85, yPos);
  } else if (balance > 0) {
    doc.setTextColor(200, 0, 0).setFont("helvetica", "bold");
    doc.text("BALANCE DUE:", 30, yPos);
    doc.text(`Ksh ${balance.toLocaleString()}`, 85, yPos);
  } else {
    doc.setTextColor(34, 197, 94).setFont("helvetica", "bold");
    doc.text("ACCOUNT BALANCE:", 30, yPos);
    doc.text("CLEARED / FULLY PAID", 85, yPos);
  }

  // --- 8. STATUS STAMP ---
  doc
    .setDrawColor(...STAMP_COLOR)
    .setLineWidth(1.2)
    .rect(pageWidth - 65, 172, 50, 14);
  doc
    .setTextColor(...STAMP_COLOR)
    .setFontSize(10)
    .setFont("helvetica", "bold");
  doc.text(statusText, pageWidth - 40, 181, { align: "center" });

  // --- 9. FOOTER ---
  doc.setTextColor(150).setFontSize(9).setFont("helvetica", "normal");
  doc.text(
    "Proof of payment for Bright Coders Academy. Non-refundable after course commencement.",
    pageWidth / 2,
    210,
    { align: "center" }
  );
  doc
    .setFont("helvetica", "bold")
    .text(
      "Empowering the next generation of tech leaders.",
      pageWidth / 2,
      216,
      { align: "center" }
    );

  // --- 10. SAVE ---
  const fileName = `Receipt_${studentData.registration_number}.pdf`;
  const filePath = path.join(dir, fileName);

  try {
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
    fs.writeFileSync(filePath, pdfBuffer);
    return { filePath, fileName, success: true };
  } catch (error) {
    console.error("PDF Save Error:", error);
    return { success: false, error: error.message };
  }
};
