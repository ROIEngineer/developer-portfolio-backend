import express from "express"; // server framework
import cors from "cors"; // allows frontend to talk to backend
import dotenv from "dotenv"; // keeps environment variables credentials secure
import nodemailer from "nodemailer"; // sends emails
import validator from "validator"; // validates emails
import rateLimit from "express-rate-limit";
import { logEvent } from "./utils/logger.js";
import { pool } from "./db/postgres.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rate limiter
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 requests per IP
  handler: (req, res) => {
    logEvent("RATE_LIMITED", {
      ip: req.ip,
    });

    res.status(429).json({
      error: "Too many requests. Please try again later.",
    });
  },
});

// Sends mail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST CONTACT
app.post("/api/contact", async (req, res) => {
  // Setup contact endpoint
  const {firstName, lastName, email, subject, message, company } = req.body;

  if (company) {
    logEvent("SPAM_BLOCKED", {
      ip: req.ip,
    });
    return res.status(200).json({ success: true });
  }

  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // HEAVY email validation using validator.js
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({
      error: "Please provide a valid email address"
    });
  }

  // Email length validation
  if (!validator.isLength(email, { max: 254 })) {
    return res.status(400).json({
      error: "Email address is too long"
    });
  }

  // Message length validation
  if (!message || message.length > 1000) {
    return res.status(400).json({
      error: "Message must be less than 1000 characters"
    });
  }

  // Prevents obvious XSS - basic sanitization
  const sanitizedMessage = validator.escape(message);
  const sanitizedFirstName = validator.escape(firstName);
  const sanitizedLastName = validator.escape(lastName);
  const sanitizedSubject = validator.escape(subject);

  try {
    console.log(`Attempting to send email from: ${email}`);
    console.log(`Using Gmail SMTP: ${process.env.EMAIL_USER}`);

    const mailInfo = await transporter.sendMail({
      from: `"${sanitizedFirstName} ${sanitizedLastName}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: subject || "New Portfolio Contact",
      text: `Name: ${sanitizedFirstName} ${sanitizedLastName} Email: ${email} Subject: ${sanitizedSubject} Message: ${sanitizedMessage}`,});

    console.log(`Email sent successfully: ${mailInfo.messageId}`);

    await pool.query(
      `
      INSERT INTO messages
      (first_name, last_name, email, subject, message, ip_address)
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [
        firstName,
        lastName,
        email,
        subject || null,
        message,
        req.ip,
      ]
    );

    logEvent("SUCCESS", {
      ip: req.ip,
      email,
      subject,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("SMTP Error details:", {
      error: error.message,
      code: error.code,
      command: error.command || 'N/A'
    });

    // Check for specific Gmail/SMTP errors
    if (error.code === 'ECONNREFUSED') {
      console.error("Connection refused - likely port blocked by Render");
    }

    logEvent("ERROR", {
      ip: req.ip,
      error: error.message,
      details: error.code
    });

    res.status(500).json({ error: "Failed to send email" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Handle Pool Shutdown - Resource-awareness
process.on("SIGINT", async () => {
  await pool.end();
  process.exit(0);
});
