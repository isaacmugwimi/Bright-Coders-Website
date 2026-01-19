// mailer.js or a separate template file

export const generateAdminEmailHtml = (newRegistration) => {
  // Move your getPaymentBadge inside or keep it accessible
  const getPaymentBadge = (status) => {
    const map = {
      paid: { bg: "#dcfce7", color: "#166534", text: "PAID" },
      pending: { bg: "#fef9c3", color: "#854d0e", text: "PENDING" },
      awaiting_verification: {
        bg: "#fff7ed",
        color: "#c2410c",
        text: "AWAITING VERIFICATION",
      },
    };
    const badge = map[status] || map.pending;
    return `<span style="background:${badge.bg}; color:${badge.color}; padding:4px 12px; border-radius:999px; font-size:12px; font-weight:600;">${badge.text}</span>`;
  };

  return `
    <div style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:12px; border:1px solid #e5e7eb; font-family:sans-serif;">
      <div style="background:#2563eb;padding:24px;text-align:center;">
        <h1 style="margin:0;color:#ffffff;font-size:22px;">🎓 New Student Registration</h1>
      </div>
      <div style="padding:26px;">
        <table style="width:100%; border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#6b7280;">Student Name</td><td style="font-weight:600;">${newRegistration.child_name}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Course</td><td style="font-weight:600;">${newRegistration.course_name}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Payment Status</td><td>${getPaymentBadge(newRegistration.payment_status)}</td></tr>
        </table>
        <div style="text-align:center;margin-top:30px;">
          <a href="https://yourdomain.com/dashboard" style="background:#2563eb; color:#ffffff; padding:12px 20px; border-radius:8px; text-decoration:none;">Review Dashboard</a>
        </div>
      </div>
    </div>
  `;
};




export const generateTestimonialAdminEmail = ({ userName, message }) => {
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
            <a href="http://brightcoders.com/dashboard"
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

