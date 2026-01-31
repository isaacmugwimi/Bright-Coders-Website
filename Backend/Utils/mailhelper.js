
export const generateAdminEmailHtml = (newRegistration) => {
  const getPaymentBadge = (status) => {
    const map = {
      paid: { bg: "#DEF7EC", color: "#03543F", text: "FULLY PAID" },
      partial: { bg: "#E1EFFE", color: "#1E429F", text: "PARTIAL PAYMENT" },
      pending: { bg: "#FDF6B2", color: "#723B13", text: "PENDING" },
      awaiting_verification: { bg: "#FEF3C7", color: "#92400E", text: "VERIFICATION NEEDED" },
    };
    const badge = map[status] || map.pending;
    return `<span style="background:${badge.bg}; color:${badge.color}; padding:4px 10px; border-radius:6px; font-size:11px; font-weight:bold; letter-spacing:0.05em;">${badge.text}</span>`;
  };

  const formatCurrency = (amt) => `Ksh ${parseFloat(amt || 0).toLocaleString()}`;
  const dashboardUrl = process.env.ADMIN_URL

  return `
    <div style="background-color:#f9fafb; padding:40px 20px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); border:1px solid #e5e7eb;">
        
        <div style="background:#1e40af; padding:32px 24px; text-align:left;">
          <p style="margin:0; color:#bfdbfe; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em;">New Enrollment Alert</p>
          <h1 style="margin:8px 0 0 0; color:#ffffff; font-size:24px; font-weight:800;">${newRegistration.child_name}</h1>
        </div>

        <div style="padding:32px 24px;">
          
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; padding-bottom:24px; border-bottom:1px solid #f3f4f6;">
            <div>
              <p style="margin:0; color:#6b7280; font-size:12px;">Payment Status</p>
              <div style="margin-top:4px;">${getPaymentBadge(newRegistration.payment_status)}</div>
            </div>
            <div style="text-align:right;">
              <p style="margin:0; color:#6b7280; font-size:12px;">Amount Paid</p>
              <p style="margin:4px 0 0 0; color:#111827; font-size:18px; font-weight:700;">${formatCurrency(newRegistration.amount_paid)}</p>
            </div>
          </div>

          <h3 style="color:#111827; font-size:14px; font-weight:700; margin-bottom:16px; text-transform:uppercase;">Registration Details</h3>
          <table style="width:100%; border-collapse:collapse; font-size:14px; color:#374151;">
            <tr>
              <td style="padding:10px 0; border-bottom:1px solid #f9fafb; color:#6b7280;">Course Name</td>
              <td style="padding:10px 0; border-bottom:1px solid #f9fafb; font-weight:600; text-align:right;">${newRegistration.course_name}</td>
            </tr>
            <tr>
              <td style="padding:10px 0; border-bottom:1px solid #f9fafb; color:#6b7280;">Parent/Guardian</td>
              <td style="padding:10px 0; border-bottom:1px solid #f9fafb; font-weight:600; text-align:right;">${newRegistration.parent_name}</td>
            </tr>
            <tr>
              <td style="padding:10px 0; border-bottom:1px solid #f9fafb; color:#6b7280;">Phone Number</td>
              <td style="padding:10px 0; border-bottom:1px solid #f9fafb; font-weight:600; text-align:right;">${newRegistration.parent_phone}</td>
            </tr>
            <tr>
              <td style="padding:10px 0; color:#6b7280;">M-Pesa Code</td>
              <td style="padding:10px 0; font-weight:600; text-align:right; color:#2563eb;">${newRegistration.mpesa_code || 'N/A'}</td>
            </tr>
          </table>

          <div style="margin-top:32px; text-align:center;">
            <a href= "${dashboardUrl}"
               style="display:inline-block; background:#1e40af; color:#ffffff; padding:14px 32px; border-radius:8px; text-decoration:none; font-weight:700; font-size:14px; box-shadow:0 4px 6px -1px rgba(30, 64, 175, 0.2);">
               Verify in Dashboard
            </a>
          </div>

          <p style="margin-top:32px; font-size:12px; color:#9ca3af; text-align:center; line-height:1.5;">
            This is an automated notification from the Bright Coders Enrollment System. 
            <br/> Please process this registration within 24 hours.
          </p>
        </div>
      </div>
    </div>
  `;
};


export const generateTestimonialAdminEmail = ({ userName, message }) => {
  const ADMIN_DASHBOARD_URL = process.env.FRONTEND_URL || "http://localhost:5173"
  return {
    subject: "🌟 New Testimonial Received",
    html: `
      <div style="
        max-width:600px;
        margin:0 auto;
        background:#ffffff;
        border-radius:12px;
        border:1px solid #e5e7eb;
        overflow:hidden;
        font-family:'Segoe UI',Tahoma,Arial,sans-serif;
        color:#1f2937;
      ">

        <!-- HEADER -->
        <div style="background:#16a34a;padding:22px;text-align:center;">
          <h2 style="margin:0;color:#ffffff;font-size:22px;">
            🌟 New Testimonial Submitted
          </h2>
          <p style="margin-top:6px;color:#dcfce7;font-size:14px;">
            Pending admin approval
          </p>
        </div>

        <!-- BODY -->
        <div style="padding:26px;">

          <div style="
            background:#f9fafb;
            border-left:4px solid #16a34a;
            padding:18px;
            border-radius:8px;
            margin-bottom:20px;
          ">
            <p style="margin:0;font-size:14px;color:#6b7280;">From</p>
            <p style="margin:4px 0 0;font-size:16px;font-weight:600;">
              ${userName}
            </p>
          </div>

          <div style="margin-bottom:24px;">
            <p style="font-size:14px;color:#6b7280;margin-bottom:8px;">
              Testimonial Message
            </p>
            <p style="
              font-size:15px;
              line-height:1.6;
              background:#f9fafb;
              padding:16px;
              border-radius:8px;
              margin:0;
            ">
              “${message}”
            </p>
          </div>

          <!-- STATUS -->
          <div style="text-align:center;margin-bottom:30px;">
            <span style="
              background:#fff7ed;
              color:#c2410c;
              padding:6px 14px;
              border-radius:999px;
              font-size:12px;
              font-weight:600;
            ">
              STATUS: HIDDEN (Awaiting Approval)
            </span>
          </div>

          <!-- CTA -->
          <div style="text-align:center;">
            <a href="${ADMIN_DASHBOARD_URL}/"
              style="
                background:#16a34a;
                color:#ffffff;
                text-decoration:none;
                padding:12px 24px;
                border-radius:8px;
                font-size:14px;
                font-weight:600;
                display:inline-block;
              ">
              Review in Admin Dashboard
            </a>
          </div>

        </div>

        <!-- FOOTER -->
        <div style="
          background:#f3f4f6;
          padding:14px;
          text-align:center;
          font-size:12px;
          color:#6b7280;
        ">
          © 2026 Bright Coders Academy • Testimonial Notification
        </div>

      </div>
    `,
  };
};


export const generatePasswordResetEmailHtml = (resetUrl) => {
  return `
    <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; border:1px solid #e5e7eb; overflow:hidden; font-family:'Segoe UI', Tahoma, Arial, sans-serif; color:#1f2937;">
      <div style="background:#2563eb; padding:30px; text-align:center;">
        <h1 style="margin:0; color:#ffffff; font-size:24px;">🔑 Password Reset Request</h1>
      </div>

      <div style="padding:30px; line-height:1.6;">
        <p style="font-size:16px; margin-bottom:20px;">Hello,</p>
        <p style="font-size:16px; color:#4b5563;">
          We received a request to reset the password for your <strong>Bright Coders Academy</strong> account. 
          Click the button below to choose a new password.
        </p>

        <div style="text-align:center; margin:35px 0;">
          <a href="${resetUrl}" 
             style="background:#2563eb; color:#ffffff; padding:14px 28px; border-radius:8px; text-decoration:none; font-weight:600; font-size:16px; display:inline-block;">
             Reset My Password
          </a>
        </div>

        <p style="font-size:14px; color:#6b7280; border-top:1px solid #e5e7eb; padding-top:20px;">
          <strong>Link Expiry:</strong> This link will expire in 15 minutes.<br>
          If you did not request this, please ignore this email or contact support if you have concerns.
        </p>
        
        <p style="font-size:12px; color:#9ca3af; margin-top:10px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <span style="word-break:break-all; color:#2563eb;">${resetUrl}</span>
        </p>
      </div>

      <div style="background:#f3f4f6; padding:20px; text-align:center; font-size:12px; color:#6b7280;">
        © 2026 Bright Coders Academy • Secure Authentication System
      </div>
    </div>
  `;
};
