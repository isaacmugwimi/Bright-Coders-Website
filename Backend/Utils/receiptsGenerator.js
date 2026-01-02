import { jsPDF } from "jspdf";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateAndSaveReceipt = async (studentData) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString();
  const pageWidth = 210; // Standard A4 width in mm

  const dir = "./receipts";
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  // --- 1. COLORS & STYLING ---
  const PRIMARY_BLUE = [37, 99, 235];
  const LIGHT_GRAY = [248, 250, 252];
  const TEXT_DARK = [30, 41, 59];
  const SUCCESS_GREEN = [34, 197, 94];

  // --- 2. WATERMARK ---
  doc.setTextColor(240, 240, 240);
  doc.setFontSize(50);
  doc.setFont("helvetica", "bold");
  doc.saveGraphicsState();
  doc.setGState(new doc.GState({ opacity: 0.1 }));
  doc.text("BRIGHT CODERS ACADEMY", pageWidth / 2, 150, {
    align: "center",
    angle: 45,
  });
  doc.restoreGraphicsState();

  // --- 3. BLUE HEADER BACKGROUND ---
  doc.setFillColor(...PRIMARY_BLUE);
  doc.rect(0, 0, pageWidth, 72, "F");

  // --- 4. CENTERED LOGO ---
  const logoWidth = 45;
  const logoHeight = 45;
  const logoX = (pageWidth - logoWidth) / 2;

  try {
    const logoPath = path.join(__dirname, "../assets/logo2.png");
    const logoBuffer = fs.readFileSync(logoPath);
    const logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;

    doc.addImage(logoBase64, "PNG", logoX, 8, logoWidth, logoHeight);
  } catch (err) {
    console.error("Logo file error:", err.message);
  }

  // --- 5. CENTERED ACADEMY NAME & INFO ---
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("BRIGHT CODERS ACADEMY", pageWidth / 2, 62, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Nairobi, Kenya | info@brightcoders.com", pageWidth / 2, 52, {
    align: "center",
  });

  // --- 6. RECEIPT TITLE & NUMBER ---
  doc.setTextColor(...TEXT_DARK);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("OFFICIAL RECEIPT", 15, 80);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Receipt No: ${studentData.registration_number}`, 15, 87);
  doc.text(`Date: ${date}`, pageWidth - 15, 87, { align: "right" });

  // --- 7. BILLING INFO BOX ---
  doc.setFillColor(...LIGHT_GRAY);
  doc.rect(15, 95, 180, 75, "F");

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("STUDENT & PAYMENT DETAILS", 25, 105);
  doc.setDrawColor(...PRIMARY_BLUE);
  doc.line(25, 107, 90, 107);

  let yPos = 120;
  const details = [
    ["Parent Name:", studentData.parent_name],
    ["Child Name:", studentData.child_name],
    ["Course Enrolled:", studentData.course_name],
    ["Transaction Code:", studentData.mpesa_code || "N/A"],
  ];

  details.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 30, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(String(value), 80, yPos);
    yPos += 12;
  });

  // --- 8. STATUS STAMP (ALIGNED RIGHT) ---
  const stampWidth = 40;
  const stampHeight = 12;
  const stampX = pageWidth - 15 - stampWidth; // Aligns with the right edge of the gray box
  const stampY = 150;

  doc.setDrawColor(...SUCCESS_GREEN);
  doc.setLineWidth(0.8);
  doc.rect(stampX, stampY, stampWidth, stampHeight); // Draw the box

  doc.setTextColor(...SUCCESS_GREEN);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  // Center text inside the green box
  doc.text("FULLY PAID", stampX + stampWidth / 2, stampY + 8, {
    align: "center",
  });

  // --- 9. FOOTER ---
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(9);
  doc.text(
    "This is a computer-generated receipt and requires no signature.",
    pageWidth / 2,
    190,
    { align: "center" }
  );
  doc.setFont("helvetica", "bold");
  doc.text(
    "Thank you for choosing Bright Coders Academy!",
    pageWidth / 2,
    196,
    { align: "center" }
  );

  // --- 10. SAVE LOGIC ---
  const fileName = `Receipt_${studentData.registration_number}.pdf`;
  const filePath = path.join(dir, fileName);
  const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
  fs.writeFileSync(filePath, pdfBuffer);

  return { filePath, fileName };
};
