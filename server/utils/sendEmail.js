const nodemailer = require("nodemailer")

const sendEmail = async ({ to, subject, html }) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT === "465",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    // Send email
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    })

    console.log(`Email sent: ${info.messageId}`)
    return info
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}

module.exports = sendEmail
