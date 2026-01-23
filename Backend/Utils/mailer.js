import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // Port 465 is for SSL - much more stable on cloud platforms like Render
  secure: true, // Use true for port 465, false for port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Ensure this is a 16-character App Password
  },
  tls: {
    // This allows the connection to succeed even if the server's 
    // certificate handshake is slightly different in a cloud environment
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000, // 10 seconds timeout
});

// Verify the connection configuration immediately on startup
transporter.verify(function (error, success) {
  if (error) {
    console.log("Mail Transporter Error:", error);
  } else {
    console.log("Mail Server is ready to send messages ✅");
  }
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

export const sendOTPEmail = async (email, otp) => {
  try {
    // if (process.env.NODE_ENV !== "production") {
    //   console.log(`[DEV OTP] ${email}: ${otp}`);
    //   return;
    // }
    const mailOptions = {
      from: '"Developer Isaac" <developerisaac92@gmail.com>',
      to: email,
      subject: "Your Login Verification Code",
      html: `
      <div style="max-width: 500px; margin: auto; padding: 20px; font-family: Arial, sans-serif; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #2563eb; text-align: center;">Two-Factor Authentication</h2>

        <p>Hello,</p>

        <p>Your one-time verification code is:</p>

        <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; text-align: center; margin: 20px 0; color: #111827;">
          ${otp}
        </div>

        <p>This code will expire in <strong>5 minutes</strong>.</p>

        <p>If you did not attempt to log in, please ignore this email.</p>

        <hr style="margin: 30px 0;" />

        <p style="font-size: 12px; color: #6b7280; text-align: center;">
          © 2026 Bright Coders Academy<br/>
          Nairobi, Kenya
        </p>
      </div>
    `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("OTP sent:", info.messageId);
  } catch (error) {
    console.error("[OTP Email Error]:", error);
  }
};

export const sendAdminNotification = async (subject, htmlContent) => {
  const mailOptions = {
    from: `"Academy Alerts" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL, // Your email address
    subject: subject,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Admin notification sent!");
  } catch (error) {
    console.error("Email failed to send:", error);
  }
};
