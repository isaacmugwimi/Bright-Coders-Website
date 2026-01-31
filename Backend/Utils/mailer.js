import { Resend } from "resend";
import fs from "fs";

// Initialize Resend with your API Key from Render Environment Variables
const resend = new Resend(process.env.RESEND_API_KEY);

// Verification check for the API key
if (!process.env.RESEND_API_KEY) {
  console.log("Resend API Key is missing! ❌");
} else {
  console.log("Resend Mailer is configured and ready ✅");
}

export const sendPaymentConfirmation = async (studentData, fileInfo) => {
  try {
    let attachments = [];
    
    // Only try to attach if the local path exists
    if (fileInfo?.filePath && fs.existsSync(fileInfo.filePath)) {
      const fileBuffer = fs.readFileSync(fileInfo.filePath);
      attachments.push({
        filename: fileInfo.fileName,
        content: fileBuffer.toString("base64"),
      });
    }

    const { data, error } = await resend.emails.send({
      from: "Bright Coders <onboarding@resend.dev>",
      to: studentData.parent_email,
      subject: `Payment Confirmed: Enrollment for ${studentData.child_name}`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; font-family: sans-serif;">
          <div style="background-color: #2563eb; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Enrollment Confirmed!</h1>
          </div>
          <div style="padding: 30px; color: #333333;">
            <p style="font-size: 16px;">Hello <strong>${studentData.parent_name}</strong>,</p>
            <p>Great news! We have successfully verified your payment. <strong>${studentData.child_name}</strong> is now officially enrolled.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${fileInfo.downloadUrl}" 
                 style="background-color: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Download Official Receipt
              </a>
              <p style="font-size: 11px; color: #94a3b8; margin-top: 10px;">Link hosted securely by Cloudinary</p>
            </div>

            <div style="background-color: #f8fafc; border-radius: 6px; padding: 20px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #2563eb; font-size: 14px; text-transform: uppercase;">Registration Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 5px 0; color: #64748b;">Registration No:</td><td style="padding: 5px 0; font-weight: bold;">${studentData.registration_number}</td></tr>
                <tr><td style="padding: 5px 0; color: #64748b;">Course:</td><td style="padding: 5px 0; font-weight: bold;">${studentData.course_name}</td></tr>
                <tr><td style="padding: 5px 0; color: #64748b;">Schedule:</td><td style="padding: 5px 0; font-weight: bold;">${studentData.preferred_time}</td></tr>
              </table>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ul style="padding-left: 20px; line-height: 1.6;">
              <li>Our instructor will add you to the WhatsApp class group within 24 hours.</li>
              <li>Ensure the student has a laptop and stable internet.</li>
            </ul>
          </div>
          <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #94a3b8;">
            &copy; 2026 Bright Coders Academy. All rights reserved.
          </div>
        </div>
      `,
      attachments,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Payment Email Error:", error);
    throw error;
  }
};

export const sendOTPEmail = async (email, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Bright Coders <onboarding@resend.dev>",
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
          <hr style="margin: 30px 0;" />
          <p style="font-size: 12px; color: #6b7280; text-align: center;">© 2026 Bright Coders Academy</p>
        </div>
      `,
    });
    if (error) throw error;
    console.log("OTP sent via Resend:", data.id);
    return true;
  } catch (error) {
    console.error("[OTP Email Error]:", error);
    throw error;
  }
};

export const sendAdminNotification = async (subject, htmlContent) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Academy Alerts <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL,
      subject: subject,
      html: htmlContent,
    });
    if (error) throw error;
    console.log("Admin notification sent via Resend!");
  } catch (error) {
    console.error("Admin Email failed:", error);
  }
};


export const sendResetEmail = async (email, resetUrl) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Bright Coders <onboarding@resend.dev>",
      to: email,
      subject: "Action Required: Reset Your Password",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #eef2f7;">
                  
                  <tr>
                    <td align="center" style="background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%); padding: 40px 20px;">
                      <div style="background: rgba(255, 255, 255, 0.1); display: inline-block; padding: 10px 20px; border-radius: 50px; margin-bottom: 20px;">
                        <span style="color: #ffffff; font-weight: 700; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">Security Portal</span>
                      </div>
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Password Recovery</h1>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 40px 40px 30px 40px;">
                      <p style="font-size: 16px; color: #475569; margin-bottom: 24px; line-height: 1.6;">
                        Hello,
                      </p>
                      <p style="font-size: 16px; color: #1e293b; margin-bottom: 30px; line-height: 1.6;">
                        We received a request to access your <strong>Bright Coders Academy</strong> account. To ensure your security, please use the button below to authorize a password reset.
                      </p>
                      
                      <div style="text-align: center; margin: 40px 0;">
                        <a href="${resetUrl}" style="background-color: #2563eb; color: #ffffff; padding: 18px 36px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block; transition: all 0.3s ease; box-shadow: 0 4px 14px 0 rgba(37, 99, 235, 0.39);">
                          Reset My Password
                        </a>
                      </div>

                      <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; margin-bottom: 30px; border-radius: 0 8px 8px 0;">
                        <p style="font-size: 13px; color: #64748b; margin: 0;">
                          <strong>Security Note:</strong> This link is strictly valid for the next <strong>15 minutes</strong>. If this request was not initiated by you, your account is still secure, and no further action is required.
                        </p>
                      </div>
                      
                      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 30px 0;" />
                      
                      <p style="font-size: 12px; color: #94a3b8; line-height: 1.5;">
                        Trouble with the button? Copy and paste the URL below into your browser:
                        <br>
                        <a href="${resetUrl}" style="color: #2563eb; text-decoration: none; word-break: break-all;">${resetUrl}</a>
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td align="center" style="background-color: #f1f5f9; padding: 25px; border-top: 1px solid #eef2f7;">
                      <p style="margin: 0; font-size: 12px; color: #64748b; font-weight: 500;">
                        &copy; 2026 Bright Coders Academy &bull; Education for the Future
                      </p>
                      <p style="margin: 8px 0 0 0; font-size: 11px; color: #94a3b8;">
                        You are receiving this because a security action was triggered on your account.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("[Reset Email Error]:", error);
    throw error;
  }
};


export const sendStepUpOTPEmail = async (email, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Bright Coders Security <onboarding@resend.dev>", 
      to: email,
      // Pro move: Putting the OTP in the subject for mobile lock-screen previews
      // good move
      subject: `${otp} is your verification code`, 
      html: `
        <!DOCTYPE html>
        <html>
        <body style="background-color: #f4f7fa; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="460" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e1e8f0;">
                  
                  <tr>
                    <td align="center" style="background-color: #0f172a; padding: 32px;">
                      <div style="background: rgba(56, 189, 248, 0.1); display: inline-block; padding: 12px; border-radius: 12px; margin-bottom: 16px;">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                      </div>
                      <h2 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: -0.02em;">Account Verification</h2>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 40px 32px;">
                      <p style="margin: 0 0 16px; font-size: 15px; line-height: 24px; color: #334155;">
                        To complete your request for high-level access, please enter the following verification code on the security screen.
                      </p>

                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 32px 0;">
                        <tr>
                          <td align="center" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px;">
                            <span style="display: block; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 12px;">Verification Code</span>
                            <span style="font-family: 'SF Mono', 'Fira Code', 'Courier New', monospace; font-size: 42px; font-weight: 800; letter-spacing: 12px; color: #0f172a; margin-left: 12px;">
                              ${otp}
                            </span>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 0 0 24px; font-size: 13px; line-height: 20px; color: #64748b; text-align: center;">
                        This code is valid for <span style="color: #0f172a; font-weight: 600;">5 minutes</span>. <br/> If you didn't request this, you can safely disregard this message.
                      </p>

                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #e2e8f0; padding-top: 24px;">
                        <tr>
                          <td>
                            <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
                              <strong>Bright Coders Academy Security</strong><br/>
                              Automated Identity Verification System
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                
                <p style="margin-top: 24px; font-size: 12px; color: #94a3b8; text-align: center;">
                  © 2026 Bright Coders Academy • Baricho, Kirinyaga County, Kenya.
                </p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("[OTP Email Error]:", error);
    throw error;
  }
};