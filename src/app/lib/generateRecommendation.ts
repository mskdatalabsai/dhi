/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/Raacdeeeeegimmnnnoortt.ts;
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Store securely
});

/**
 * Generates recommendations from GPT based on score metadata
 * @param scoreData - the object containing user scores
 */
export async function generateRecommendation(scoreData: any) {
  const prompt = `
  You are a psychometric evaluation assistant.

  Given a user's performance metadata across technical and qualitative dimensions,
  generate the following JSON:
  {
    "top_roles": ["...", "..."],  // 2-3 job roles this user fits best
    "summary": "...",       // short summary of user's skills and personality traits (2-3 sentences)
    "recommendations": ["...", "...", "..."] // 3-5 specific learning or career recommendations
  }

  User assessment data:
  ${JSON.stringify(scoreData, null, 2)}

  Please make your choices based on:
  1. Strengths reflected in high scores
  2. Both technical and qualitative traits
  3. The user's detected career intent: ${scoreData.intent || "unknown"}
  4. Areas that need improvement based on lower scores
  
  Keep the tone helpful, specific, and actionable. Focus on practical next steps.
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4", // or use "gpt-3.5-turbo"
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const reply = completion.choices[0].message.content;

  try {
    return JSON.parse(reply!);
  } catch (e) {
    console.error("Failed to parse GPT reply", reply);
    return {
      top_roles: ["Software Developer", "Data Analyst"],
      summary:
        "Based on your assessment performance, you show strong analytical and problem-solving capabilities.",
      recommendations: [
        "Focus on strengthening your weaker technical areas",
        "Consider taking online courses in your target domain",
        "Build practical projects to demonstrate your skills",
      ],
    };
  }
}
