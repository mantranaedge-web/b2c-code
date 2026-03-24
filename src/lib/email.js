import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendLeadNotification(leadData) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.SALES_TEAM_EMAIL,
    subject: `New Lead: ${leadData.courseName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #0ea5e9;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 5px 5px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .field {
              margin-bottom: 15px;
              padding: 10px;
              background-color: #f8f9fa;
              border-left: 3px solid #0ea5e9;
            }
            .label {
              font-weight: bold;
              color: #0ea5e9;
              margin-bottom: 5px;
            }
            .value {
              color: #333;
            }
            .footer {
              margin-top: 20px;
              text-align: center;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 New Course Enquiry</h1>
            </div>
            <div class="content">
              <p>A new lead has been generated for your B2B EdTech platform. Here are the details:</p>
              
              <div class="field">
                <div class="label">Course Name:</div>
                <div class="value">${leadData.courseName}</div>
              </div>
              
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${leadData.name}</div>
              </div>
              
              <div class="field">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${leadData.email}">${leadData.email}</a></div>
              </div>
              
              <div class="field">
                <div class="label">Phone:</div>
                <div class="value"><a href="tel:${leadData.phone}">${leadData.phone}</a></div>
              </div>
              
              <div class="field">
                <div class="label">Company:</div>
                <div class="value">${leadData.company}</div>
              </div>
              
              ${leadData.message ? `
              <div class="field">
                <div class="label">Message:</div>
                <div class="value">${leadData.message}</div>
              </div>
              ` : ''}
              
              <div class="field">
                <div class="label">Submitted At:</div>
                <div class="value">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</div>
              </div>
            </div>
            <div class="footer">
              <p>This is an automated notification from your B2B EdTech Platform.</p>
              <p>Please follow up with the lead as soon as possible.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
}