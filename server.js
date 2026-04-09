// ============================================
// WebNestStudio - Contact Form Backend
// Built with Node.js + Express + Nodemailer
// ============================================

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allow requests from your website domain
app.use(
  cors({
    origin: [
      "https://webneststudio.in",
      "http://webneststudio.in",
      "http://localhost",       // for local testing
      "http://localhost:3000",
      "http://127.0.0.1",
    ],
    methods: ["POST", "GET"],
  })
);

// ── Email Transporter ───────────────────────
// Uses your Gmail account to send notification emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,   // Your Gmail address
    pass: process.env.GMAIL_PASS,   // Your Gmail App Password (NOT your normal password)
  },
});

// ── Health Check Route ──────────────────────
// Visit https://your-backend-url.com/ to confirm it's running
app.get("/", (req, res) => {
  res.json({ status: "✅ WebNestStudio backend is running!" });
});

// ── Contact Form Route ──────────────────────
// Your HTML form POSTs to this endpoint
app.post("/api/contact", async (req, res) => {
  const { name, email, phone, message, service } = req.body;

  // Basic validation — make sure required fields are present
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: "Name, email, and message are required.",
    });
  }

  // Simple email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: "Please provide a valid email address.",
    });
  }

  try {
    // ── Email to YOU (the company) ────────────
    await transporter.sendMail({
      from: `"WebNestStudio Contact Form" <${process.env.GMAIL_USER}>`,
      to: process.env.COMPANY_EMAIL,   // Where you want to receive leads
      replyTo: email,                  // Reply directly to the client's email
      subject: `🚀 New Inquiry from ${name} — WebNestStudio`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">

          <!-- Header -->
          <div style="background: #1a1a2e; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px;">📩 New Contact Form Submission</h1>
            <p style="color: #a0a0b0; margin: 8px 0 0;">WebNestStudio.in</p>
          </div>

          <!-- Body -->
          <div style="padding: 28px; background: #ffffff;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; width: 140px;">
                  <strong style="color: #555;">👤 Name</strong>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #222;">
                  ${name}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
                  <strong style="color: #555;">📧 Email</strong>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #222;">
                  <a href="mailto:${email}" style="color: #4f46e5;">${email}</a>
                </td>
              </tr>
              ${phone ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
                  <strong style="color: #555;">📞 Phone</strong>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #222;">
                  ${phone}
                </td>
              </tr>` : ""}
              ${service ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
                  <strong style="color: #555;">🛠️ Service</strong>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #222;">
                  ${service}
                </td>
              </tr>` : ""}
              <tr>
                <td style="padding: 12px 0; vertical-align: top;">
                  <strong style="color: #555;">💬 Message</strong>
                </td>
                <td style="padding: 12px 0; color: #222; line-height: 1.6;">
                  ${message.replace(/\n/g, "<br>")}
                </td>
              </tr>
            </table>

            <!-- CTA Button -->
            <div style="text-align: center; margin-top: 28px;">
              <a href="mailto:${email}?subject=Re: Your inquiry to WebNestStudio"
                 style="background: #4f46e5; color: #ffffff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                Reply to ${name}
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f8f8f8; padding: 16px; text-align: center; font-size: 12px; color: #999;">
            Submitted on ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
            &nbsp;·&nbsp; WebNestStudio.in
          </div>
        </div>
      `,
    });

    // ── Auto-reply to the Client ──────────────
    await transporter.sendMail({
      from: `"WebNestStudio" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Thanks for reaching out, ${name}! — WebNestStudio`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">

          <div style="background: #1a1a2e; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px;">WebNestStudio</h1>
            <p style="color: #a0a0b0; margin: 8px 0 0;">webneststudio.in</p>
          </div>

          <div style="padding: 32px; background: #ffffff;">
            <h2 style="color: #1a1a2e; margin-top: 0;">Hi ${name}! 👋</h2>
            <p style="color: #444; line-height: 1.7;">
              Thank you for getting in touch with us. We've received your message and our team will get back to you within <strong>24–48 hours</strong>.
            </p>
            <p style="color: #444; line-height: 1.7;">
              In the meantime, feel free to explore our work at
              <a href="https://webneststudio.in" style="color: #4f46e5;">webneststudio.in</a>.
            </p>
            <p style="color: #444; line-height: 1.7; margin-bottom: 0;">
              Warm regards,<br>
              <strong>The WebNestStudio Team</strong>
            </p>
          </div>

          <div style="background: #f8f8f8; padding: 16px; text-align: center; font-size: 12px; color: #999;">
            You're receiving this because you submitted a form on WebNestStudio.in
          </div>
        </div>
      `,
    });

    console.log(`✅ New contact from: ${name} <${email}>`);

    return res.status(200).json({
      success: true,
      message: "Your message has been sent! We'll be in touch soon.",
    });

  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    return res.status(500).json({
      success: false,
      error: "Something went wrong. Please try again or email us directly.",
    });
  }
});

// ── Start Server ────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 WebNestStudio backend running on port ${PORT}`);
});
