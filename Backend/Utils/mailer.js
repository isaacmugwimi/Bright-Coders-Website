import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use an "App Password," not your login password
  },
});

export const sendPaymentConfirmation = async (studentData, fileInfo) => {
  const mailOptions = {
    from: '"Developer Isaac" <developerisaac92@gmail.com>',
    to: studentData.parent_email,
    subject: `Payment Confirmed: Enrollment for ${studentData.child_name}`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <div style="background-color: #2563eb; padding: 20px; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Enrollment Confirmed!</h1>
  </div>
  
  <div style="padding: 30px; color: #333333;">
    <p style="font-size: 16px;">Hello <strong>${studentData.parent_name}</strong>,</p>
    <p>Great news! We have successfully verified your payment. <strong>${studentData.child_name}</strong> is now officially enrolled in our upcoming cohort.</p>
    
    <div style="background-color: #f8fafc; border-radius: 6px; padding: 20px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #2563eb; font-size: 14px; text-transform: uppercase;">Registration Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 5px 0; color: #64748b;">Student ID:</td>
          <td style="padding: 5px 0; font-weight: bold;">${studentData.registration_number}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #64748b;">Course:</td>
          <td style="padding: 5px 0; font-weight: bold;">${studentData.course_name}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #64748b;">Schedule:</td>
          <td style="padding: 5px 0; font-weight: bold;">${studentData.preferred_time}</td>
        </tr>
      </table>
    </div>
    <p><strong>Next Steps:</strong></p>
    <ul style="padding-left: 20px;">
      <li>Our instructor will add you to the WhatsApp class group within 24 hours.</li>
      <li>Ensure the student has a laptop and stable internet as indicated in your profile.</li>
    </ul>

   
  </div>
  
  <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #94a3b8;">
    &copy; 2026 Bright Coders Academy. All rights reserved.<br>
    Nairobi, Kenya | +254 ...
  </div>
</div>
    `,
    attachments: [
      {
        filename: fileInfo.fileName,
        path: fileInfo.filePath, // Nodemailer will pick the file from your /receipts folder
      },
    ],
  };
  return transporter.sendMail(mailOptions);
};
