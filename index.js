const dotenv = require("dotenv");
const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Serve frontend files

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: 
    process.env.EMAIL_PASS,
  },
});

// API Route to send email
app.post("/send-email", async (req, res) => {
    const { to, subject, message } = req.body;

    const mailOptions = {
        from: `"Drashti Vaghasiya" <${process.env.EMAIL_USER}>`, // Always your email
        to,
        subject,
        text: message,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully!");
        res.status(200).json({ message: "Email sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
