// pages/api/emailResult.ts
import nodemailer from "nodemailer";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { toEmail, pdfBase64, userName, score } = req.body;

  if (!toEmail || !pdfBase64) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Create email transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS, // Use App Password for Gmail
    },
  });

  try {
    const emailContent = `
Dear ${userName || "User"},

Thank you for completing the Dhiti.AI Career Assessment! 

Your assessment results are now ready. You scored ${score}% on the comprehensive evaluation that analyzed both your technical skills and qualitative traits.

Key highlights from your assessment:
• Personalized career recommendations based on your performance
• Detailed analysis of your strengths and areas for improvement  
• AI-powered suggestions for your learning path
• Insights into roles that best match your profile

Please find your detailed assessment report attached as a PDF.

Next Steps:
1. Review your personalized recommendations
2. Focus on the suggested learning areas
3. Consider the recommended career paths
4. Track your progress and retake the assessment to see your growth

For any questions about your results, please don't hesitate to reach out.

Best regards,
The Dhiti.AI Team

---
This is an automated email. Please do not reply to this address.
`;

    await transporter.sendMail({
      from: `"Dhiti.AI Assessment" <${process.env.EMAIL_FROM}>`,
      to: toEmail,
      subject: `Your Dhiti.AI Assessment Results - ${score}% Score`,
      text: emailContent,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🎯 Your Assessment Results</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Dhiti.AI Career Assessment Report</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e1e5e9;">
            <p>Dear <strong>${userName || "User"}</strong>,</p>
            
            <p>Thank you for completing the Dhiti.AI Career Assessment! Your comprehensive evaluation is now complete.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">📊 Your Score: <span style="color: #28a745; font-size: 28px;">${score}%</span></h3>
            </div>
            
            <h3 style="color: #333;">🎯 What's Inside Your Report:</h3>
            <ul style="color: #666; line-height: 1.6;">
              <li><strong>Personalized career recommendations</strong> based on your performance</li>
              <li><strong>Detailed analysis</strong> of your strengths and areas for improvement</li>
              <li><strong>AI-powered suggestions</strong> for your learning path</li>
              <li><strong>Role insights</strong> that best match your profile</li>
              <li><strong>Interactive charts</strong> showing your performance breakdown</li>
            </ul>
            
            <h3 style="color: #333;">📚 Next Steps:</h3>
            <ol style="color: #666; line-height: 1.6;">
              <li>Review your personalized recommendations</li>
              <li>Focus on the suggested learning areas</li>
              <li>Consider the recommended career paths</li>
              <li>Track your progress and retake the assessment to see your growth</li>
            </ol>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #1976d2;">💡 <strong>Tip:</strong> Your assessment report includes AI-generated insights tailored specifically to your performance pattern.</p>
            </div>
            
            <p>For any questions about your results, please don't hesitate to reach out.</p>
            
            <p>Best regards,<br><strong>The Dhiti.AI Team</strong></p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            This is an automated email. Please do not reply to this address.
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `dhiti-ai-assessment-report-${
            new Date().toISOString().split("T")[0]
          }.pdf`,
          content: pdfBase64.split("base64,")[1],
          encoding: "base64",
        },
      ],
    });

    res.status(200).json({
      message: "Assessment report sent successfully!",
      success: true,
    });
  } catch (err) {
    console.error("Email sending error:", err);
    let errorMessage = "Unknown error";
    if (err instanceof Error) {
      errorMessage = err.message;
    } else if (typeof err === "string") {
      errorMessage = err;
    }
    res.status(500).json({
      message: "Failed to send email. Please try again.",
      error: errorMessage,
    });
  }
}
