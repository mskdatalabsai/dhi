/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/emailResult/route.ts - Updated to handle multiple email types
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const {
      toEmail,
      pdfBase64,
      textContent,
      userName,
      score,
      isTextOnly,
      isSimple,
      reportUrl,
    } = await request.json();

    if (!toEmail || !toEmail.includes("@")) {
      return NextResponse.json(
        { error: "Valid email address required" },
        { status: 400 }
      );
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS, // Use App Password for Gmail
      },
    });

    let emailContent: any = {
      from: `"Dhiti.AI Assessment" <${process.env.EMAIL_FROM}>`,
      to: toEmail,
    };

    // Handle different email types
    if (isSimple) {
      // Simple email with access link and instructions
      emailContent = {
        ...emailContent,
        subject: `Your Dhiti.AI Assessment Results - ${score}% Score`,
        text: `
Dear ${userName || "User"},

Your Dhiti.AI assessment has been completed successfully!

Your Score: ${score}%

To access your full report:
1. Visit your assessment results at: ${reportUrl || "your assessment page"}
2. Use your browser's print function (Ctrl+P or Cmd+P)  
3. Select "Save as PDF" to download your report

If you have any questions, please don't hesitate to contact our support team.

Best regards,
The Dhiti.AI Team

---
Generated on ${new Date().toLocaleDateString()}
        `,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🎯 Assessment Complete!</h1>
              <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Dhiti.AI Career Assessment</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e1e5e9;">
              <p>Dear <strong>${userName || "User"}</strong>,</p>
              
              <p>Your Dhiti.AI assessment has been completed successfully!</p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <h3 style="color: #333; margin-top: 0;">📊 Your Score</h3>
                <div style="color: #28a745; font-size: 36px; font-weight: bold; margin: 10px 0;">${score}%</div>
                <p style="color: #666; margin: 0;">Congratulations on completing your assessment!</p>
              </div>
              
              <h3 style="color: #333;">📋 To Access Your Full Report:</h3>
              <ol style="color: #666; line-height: 1.8; font-size: 16px;">
                <li>Visit your results: ${
                  reportUrl
                    ? `<a href="${reportUrl}" style="color: #667eea; text-decoration: none;">${reportUrl}</a>`
                    : "your assessment page"
                }</li>
                <li>Use <strong>Ctrl+P</strong> (Windows) or <strong>Cmd+P</strong> (Mac) to open print dialog</li>
                <li>Select <strong>"Save as PDF"</strong> as your destination</li>
                <li>Click Save to download your complete report</li>
              </ol>
              
              <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #1976d2;">💡 <strong>Tip:</strong> The print-to-PDF method ensures you get the full formatted report with all charts and styling.</p>
              </div>
              
              <p>If you have any questions, please don't hesitate to contact our support team.</p>
              
              <p>Best regards,<br><strong>The Dhiti.AI Team</strong></p>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
              Generated on ${new Date().toLocaleDateString()} • This is an automated email
            </div>
          </div>
        `,
      };
    } else if (isTextOnly) {
      // Text-only email with content in email body
      emailContent = {
        ...emailContent,
        subject: `Your Dhiti.AI Assessment Report (Text Version) - ${score}%`,
        text: textContent || `Assessment completed with ${score}% score.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">📄 Your Assessment Report</h1>
              <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Text Version</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e1e5e9;">
              <p>Dear <strong>${userName || "User"}</strong>,</p>
              
              <p>Your assessment report is included below in text format:</p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <pre style="white-space: pre-line; font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.5; margin: 0; color: #333;">${
                  textContent || `Assessment completed with ${score}% score.`
                }</pre>
              </div>
              
              <p><strong>For a formatted PDF version:</strong> Please visit your results page and use the browser's print function to save as PDF.</p>
              
              <p>Thank you for using Dhiti.AI!</p>
              
              <p>Best regards,<br><strong>The Dhiti.AI Team</strong></p>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
              Generated on ${new Date().toLocaleDateString()} • This is an automated email
            </div>
          </div>
        `,
      };
    } else {
      // PDF attachment email (original functionality + enhanced error handling)
      if (!pdfBase64) {
        return NextResponse.json(
          { error: "PDF data required for PDF email type" },
          { status: 400 }
        );
      }

      // Extract base64 data (remove data:application/pdf;base64, prefix if present)
      const base64Data = pdfBase64.includes(",")
        ? pdfBase64.split(",")[1]
        : pdfBase64;

      emailContent = {
        ...emailContent,
        subject: `Your Dhiti.AI Assessment Results - ${score}% Score`,
        text: `
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
        `,
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
            content: base64Data,
            encoding: "base64",
          },
        ],
      };
    }

    // Send the email
    await transporter.sendMail(emailContent);

    // Return success response with email type info
    const emailType = isSimple ? "simple" : isTextOnly ? "text" : "pdf";

    return NextResponse.json({
      message: "Assessment report sent successfully!",
      success: true,
      emailType: emailType,
      sentTo: toEmail,
    });
  } catch (error) {
    console.error("Email sending error:", error);

    let errorMessage = "Unknown error";
    let errorDetails = "";

    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack || "";
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    // Log more details for debugging
    console.error("Detailed error:", {
      message: errorMessage,
      details: errorDetails,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        message: "Failed to send email. Please try again.",
        error: errorMessage,
        success: false,
      },
      { status: 500 }
    );
  }
}
