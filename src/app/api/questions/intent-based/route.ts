/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// api/questions/intent-based/route.ts - Enhanced with OpenAI optimization and improved question fetching

import { NextRequest, NextResponse } from "next/server";
import adminDb from "../../../lib/firebase/admin";
import {
  roleToCollection,
  intentQualitativeMapping,
  experienceDifficultyMap,
  explorationDomains,
} from "../../../lib/config/roleMapping";
import type { FirestoreQuestion } from "../../../types/firestore";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey:
        "REMOVED_SECRET",
    })
  : null;

interface IntentBasedRequest {
  intent: "confused" | "interested" | "grow" | "switch";
  experience: string;
  current_role?: string;
  target_roles?: string[];
  age_group?: string;
  education?: string;
  purpose?: string;
  useAIOptimization?: boolean; // Optional flag to use AI for question distribution
}

interface QuestionDistribution {
  technicalDomains: {
    domain: string;
    count: number;
    difficulty?: Record<string, number>;
  }[];
  qualitativeClusters: { cluster: string; count: number }[];
  focusAreas?: string[];
  difficultyStrategy?: string;
}

// Helper function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get question distribution using OpenAI
async function getAIQuestionDistribution(
  request: IntentBasedRequest
): Promise<QuestionDistribution | null> {
  if (!openai || !request.useAIOptimization) {
    console.log("🤖 AI optimization disabled or OpenAI not available");
    return null;
  }

  try {
    console.log("🤖 Using OpenAI for intelligent question distribution...");

    // Get actual available clusters for this intent
    const availableClusters =
      intentQualitativeMapping[request.intent]?.clusters || [];
    const clusterNames = Array.isArray(availableClusters)
      ? availableClusters
      : Object.keys(availableClusters);

    const prompt = `As an assessment expert, create an optimal question distribution for this user:

Intent: ${request.intent}
Experience: ${request.experience}
Current Role: ${request.current_role || "None"}
Target Roles: ${request.target_roles?.join(", ") || "None"}
Age Group: ${request.age_group || "Not specified"}
Purpose: ${request.purpose || "Not specified"}

AVAILABLE TECHNICAL DOMAINS (use exact names):
${Object.entries(roleToCollection)
  .map(([role, collection]) => `- ${collection}`)
  .join("\n")}

AVAILABLE QUALITATIVE CLUSTERS (use exact names):
${clusterNames.join(", ")}

RULES:
1. Use ONLY domains from the available list above
2. Use ONLY cluster names from the available list above
3. Total exactly 40 technical questions
4. Total exactly 29 qualitative questions
5. Focus on domains relevant to "${
      request.target_roles?.join(" and ") || "user goals"
    }"
6. Adjust difficulty for ${request.experience} level

For difficulty distribution (use these exact names: "easy", "Medium", "Hard"):
- Fresher (0 years): 70% easy, 30% Medium, 0% Hard
- 1-3 years: 40% easy, 50% Medium, 10% Hard
- 4+ years: 20% easy, 50% Medium, 30% Hard

IMPORTANT: Use exactly these difficulty names: "easy", "Medium", "Hard" (note the capital M in Medium and H in Hard)

Respond with VALID JSON only:
{
  "technicalDomains": [
    {"domain": "exact_domain_name_from_list", "count": number, "difficulty": {"easy": number, "Medium": number, "Hard": number}}
  ],
  "qualitativeClusters": [
    {"cluster": "exact_cluster_name_from_list", "count": number}
  ],
  "focusAreas": ["Key skill areas to assess"],
  "difficultyStrategy": "Explanation of difficulty distribution"
}

Example valid domains: Design_and_User_Experience_UX_Designer, Engineering_Development_Software_engineer_or_developer
Example valid clusters: ${clusterNames.slice(0, 3).join(", ")}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in IT career assessments. Respond only with valid JSON using exact domain and cluster names provided. Use exactly these difficulty levels: 'easy', 'Medium', 'Hard'.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.2, // Lower temperature for more consistent naming
      max_tokens: 800,
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      console.log("❌ No response from OpenAI");
      return null;
    }

    console.log("📄 OpenAI raw response:", responseText);

    // Parse OpenAI response
    const aiResponse = JSON.parse(responseText);

    // Validate the response structure
    if (!aiResponse.technicalDomains || !aiResponse.qualitativeClusters) {
      console.log("❌ Invalid AI response structure");
      return null;
    }

    // Validate and fix technical domains
    let technicalTotal = aiResponse.technicalDomains.reduce(
      (sum: number, domain: any) => {
        return sum + (domain.count || 0);
      },
      0
    );

    // Validate and fix qualitative clusters
    const qualitativeTotal = aiResponse.qualitativeClusters.reduce(
      (sum: number, cluster: any) => {
        return sum + (cluster.count || 0);
      },
      0
    );

    console.log("📊 AI Distribution Validation:");
    console.log(`- Technical questions: ${technicalTotal}/40`);
    console.log(`- Qualitative questions: ${qualitativeTotal}/29`);

    // Adjust technical total to exactly 40
    if (technicalTotal !== 40) {
      console.log("⚖️ Adjusting technical question distribution to total 40");
      const adjustment = 40 - technicalTotal;
      if (aiResponse.technicalDomains.length > 0) {
        aiResponse.technicalDomains[0].count += adjustment;

        // Also adjust the difficulty distribution proportionally
        if (aiResponse.technicalDomains[0].difficulty) {
          const oldCount = aiResponse.technicalDomains[0].count - adjustment;
          const newCount = aiResponse.technicalDomains[0].count;
          const ratio = newCount / oldCount;

          aiResponse.technicalDomains[0].difficulty.easy = Math.round(
            aiResponse.technicalDomains[0].difficulty.easy * ratio
          );
          aiResponse.technicalDomains[0].difficulty.Medium = Math.round(
            aiResponse.technicalDomains[0].difficulty.Medium * ratio
          );
          aiResponse.technicalDomains[0].difficulty.Hard = Math.round(
            aiResponse.technicalDomains[0].difficulty.Hard * ratio
          );
        }

        // Recalculate technical total
        technicalTotal = aiResponse.technicalDomains.reduce(
          (sum: number, domain: any) => {
            return sum + (domain.count || 0);
          },
          0
        );
      }
    }

    // Adjust qualitative total to exactly 29
    if (qualitativeTotal !== 29) {
      console.log("⚖️ Adjusting qualitative question distribution to total 29");
      const adjustment = 29 - qualitativeTotal;
      if (aiResponse.qualitativeClusters.length > 0) {
        aiResponse.qualitativeClusters[0].count += adjustment;
      }
    }

    // Validate cluster names exist
    const validClusters = aiResponse.qualitativeClusters.filter(
      (cluster: any) => {
        const isValid = clusterNames.includes(cluster.cluster);
        if (!isValid) {
          console.log(`❌ Invalid cluster name: ${cluster.cluster}`);
        }
        return isValid;
      }
    );

    // If no valid clusters, use default mapping
    if (validClusters.length === 0) {
      console.log("⚠️ No valid clusters found, using default mapping");
      const defaultMapping = intentQualitativeMapping[request.intent];
      if (defaultMapping) {
        aiResponse.qualitativeClusters = defaultMapping.clusters.map(
          (cluster: string, index: number) => ({
            cluster,
            count: defaultMapping.distribution[index] || 10,
          })
        );
      }
    } else {
      aiResponse.qualitativeClusters = validClusters;
    }

    console.log("✅ OpenAI question distribution successful!");
    console.log("📋 Final distribution:");
    console.log(
      "Technical Domains:",
      aiResponse.technicalDomains.map(
        (d: any) => `${d.domain}: ${d.count} (${JSON.stringify(d.difficulty)})`
      )
    );
    console.log(
      "Qualitative Clusters:",
      aiResponse.qualitativeClusters.map((c: any) => `${c.cluster}: ${c.count}`)
    );

    return aiResponse;
  } catch (error) {
    console.error("❌ Error getting OpenAI question distribution:", error);
    return null;
  }
}

// Create smart distribution based on classification results (fallback for when OpenAI fails)
function createSmartDistribution(
  request: IntentBasedRequest,
  classificationResult?: any
): QuestionDistribution {
  const { intent, experience, current_role, target_roles } = request;

  let distribution: QuestionDistribution;

  switch (intent) {
    case "confused":
      distribution = {
        technicalDomains: [
          {
            domain: "web_development",
            count: 15,
            difficulty: { easy: 12, Medium: 3, Hard: 0 },
          },
          {
            domain: "data_science",
            count: 13,
            difficulty: { easy: 10, Medium: 3, Hard: 0 },
          },
          {
            domain: "mobile_development",
            count: 12,
            difficulty: { easy: 9, Medium: 3, Hard: 0 },
          },
        ],
        qualitativeClusters: [
          { cluster: "exploration", count: 10 },
          { cluster: "learning_style", count: 10 },
          { cluster: "career_values", count: 9 },
        ],
        focusAreas: [
          "Programming fundamentals",
          "Domain exploration",
          "Learning preferences",
        ],
        difficultyStrategy:
          "Focus on easy questions to build confidence and explore interests",
      };
      break;

    case "interested":
      const targetDomains = target_roles?.map(
        (role) => roleToCollection[role] || "web_development"
      ) || ["web_development"];

      const questionsPerDomain = Math.floor(40 / targetDomains.length);

      distribution = {
        technicalDomains: targetDomains.map((domain) => ({
          domain,
          count: questionsPerDomain,
          difficulty:
            experience === "Fresher (0 years)"
              ? {
                  easy: Math.floor(questionsPerDomain * 0.6),
                  Medium: Math.floor(questionsPerDomain * 0.4),
                  Hard: 0,
                }
              : {
                  easy: Math.floor(questionsPerDomain * 0.3),
                  Medium: Math.floor(questionsPerDomain * 0.5),
                  Hard: Math.floor(questionsPerDomain * 0.2),
                },
        })),
        qualitativeClusters: [
          { cluster: "role_fit", count: 12 },
          { cluster: "technical_aptitude", count: 10 },
          { cluster: "growth_mindset", count: 7 },
        ],
        focusAreas: target_roles || ["Target role skills"],
        difficultyStrategy:
          experience === "Fresher (0 years)"
            ? "Balanced easy-medium difficulty to assess readiness for target roles"
            : "Balanced difficulty with some Hard questions to assess expertise",
      };
      break;

    case "grow":
      const currentDomain = current_role
        ? roleToCollection[current_role] || "web_development"
        : "web_development";

      distribution = {
        technicalDomains: [
          {
            domain: currentDomain,
            count: 40,
            difficulty: { easy: 5, Medium: 20, Hard: 15 },
          },
        ],
        qualitativeClusters: [
          { cluster: "leadership", count: 12 },
          { cluster: "expertise_depth", count: 10 },
          { cluster: "mentoring", count: 7 },
        ],
        focusAreas: [
          "Advanced technical skills",
          "Leadership development",
          "Mentoring abilities",
        ],
        difficultyStrategy:
          "Focus on Medium and Hard questions to assess growth potential",
      };
      break;

    case "switch":
      const currentCol = current_role ? roleToCollection[current_role] : null;
      const targetCols =
        target_roles?.map((role) => roleToCollection[role]).filter(Boolean) ||
        [];

      const domains = [];
      if (currentCol) {
        domains.push({
          domain: currentCol,
          count: 20,
          difficulty: { easy: 5, Medium: 10, Hard: 5 },
        });
      }

      const remainingCount = 40 - (currentCol ? 20 : 0);
      const countPerTarget = Math.floor(
        remainingCount / Math.max(targetCols.length, 1)
      );

      targetCols.forEach((domain) => {
        domains.push({
          domain,
          count: countPerTarget,
          difficulty: {
            easy: Math.floor(countPerTarget * 0.6),
            Medium: Math.floor(countPerTarget * 0.4),
            Hard: 0,
          },
        });
      });

      // Fill remaining if needed
      const totalAssigned = domains.reduce((sum, d) => sum + d.count, 0);
      if (totalAssigned < 40 && domains.length > 0) {
        domains[0].count += 40 - totalAssigned;
      }

      distribution = {
        technicalDomains: domains,
        qualitativeClusters: [
          { cluster: "adaptability", count: 12 },
          { cluster: "transferable_skills", count: 10 },
          { cluster: "career_transition", count: 7 },
        ],
        focusAreas: [
          "Transferable skills",
          "New domain skills",
          "Adaptability",
        ],
        difficultyStrategy:
          "Mixed difficulty to assess current skills and learning potential",
      };
      break;

    default:
      // Fallback distribution
      distribution = {
        technicalDomains: [
          {
            domain: "web_development",
            count: 40,
            difficulty: { easy: 20, Medium: 15, Hard: 5 },
          },
        ],
        qualitativeClusters: [
          { cluster: "general_aptitude", count: 15 },
          { cluster: "problem_solving", count: 14 },
        ],
        focusAreas: ["General technical skills"],
        difficultyStrategy: "Balanced difficulty distribution",
      };
  }

  return distribution;
}

// IMPROVED: Enhanced helper function to get random questions from a collection with better fallback logic
async function getQuestionsFromCollection(
  collectionPath: string,
  count: number,
  difficulty?: string | Record<string, number>
): Promise<FirestoreQuestion[]> {
  try {
    if (typeof difficulty === "object") {
      // Fetch questions by multiple difficulty levels with fallback logic
      const questions: FirestoreQuestion[] = [];
      const totalRequested = Object.values(difficulty).reduce(
        (sum, val) => sum + val,
        0
      );

      console.log(
        `🎯 Fetching ${totalRequested} questions from ${collectionPath} with difficulty breakdown:`,
        difficulty
      );

      for (const [level, levelCount] of Object.entries(difficulty)) {
        if (levelCount > 0) {
          console.log(`  - Requesting ${levelCount} ${level} questions`);
          const levelQuestions = await getQuestionsFromCollection(
            collectionPath,
            levelCount,
            level
          );
          console.log(`  - Got ${levelQuestions.length} ${level} questions`);
          questions.push(...levelQuestions);
        }
      }

      // FALLBACK: If we didn't get enough questions with difficulty constraints,
      // fetch additional questions without difficulty constraint
      if (questions.length < totalRequested) {
        const shortfall = totalRequested - questions.length;
        console.log(
          `⚠️ Shortfall of ${shortfall} questions in ${collectionPath}, fetching additional questions without difficulty constraint`
        );

        const additionalQuestions = await getQuestionsFromCollection(
          collectionPath,
          shortfall * 2 // Request more to account for potential duplicates
        );

        // Filter out questions we already have (by ID)
        const existingIds = new Set(questions.map((q) => q.id));
        const newQuestions = additionalQuestions.filter(
          (q) => !existingIds.has(q.id)
        );

        questions.push(...newQuestions.slice(0, shortfall));
        console.log(
          `✅ Added ${Math.min(
            newQuestions.length,
            shortfall
          )} additional questions from ${collectionPath}`
        );
      }

      console.log(
        `📊 Final result for ${collectionPath}: ${questions.length}/${totalRequested} questions`
      );
      return questions;
    }

    // Single difficulty level or no difficulty constraint
    let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> =
      adminDb.collection(collectionPath);

    if (difficulty && typeof difficulty === "string") {
      query = query.where("level", "==", difficulty);
    }

    const snapshot = await query.get();
    const questions: FirestoreQuestion[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      questions.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate
          ? data.createdAt.toDate()
          : new Date(),
        updatedAt: data.updatedAt?.toDate
          ? data.updatedAt.toDate()
          : new Date(),
      } as FirestoreQuestion);
    });

    const available = questions.length;
    const requested = count;

    if (available < requested) {
      console.log(
        `⚠️ ${collectionPath} (${
          difficulty || "any"
        }): Only ${available}/${requested} questions available`
      );
    } else {
      console.log(
        `✅ ${collectionPath} (${
          difficulty || "any"
        }): ${available}/${requested} questions available`
      );
    }

    // Shuffle and return requested count
    const result = shuffleArray(questions).slice(0, count);
    return result;
  } catch (error) {
    console.error(`❌ Error fetching from ${collectionPath}:`, error);
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: IntentBasedRequest = await request.json();
    const { intent, experience, current_role, target_roles = [] } = body;

    console.log("Processing intent-based question selection:", {
      intent,
      experience,
      useAI: body.useAIOptimization,
    });

    let technicalQuestions: FirestoreQuestion[] = [];
    let qualitativeQuestions: FirestoreQuestion[] = [];
    let distribution: QuestionDistribution | null = null;

    // Try to get AI-optimized distribution using OpenAI
    if (body.useAIOptimization) {
      distribution = await getAIQuestionDistribution(body);
      console.log("AI distribution:", distribution);
    }

    // If AI distribution is available, use it
    if (distribution) {
      console.log("🤖 Using AI-optimized question selection");

      // Fetch technical questions based on AI distribution
      for (const domain of distribution.technicalDomains) {
        const collectionPath = `questions/technical/${domain.domain}`;
        console.log(
          `📚 Fetching ${domain.count} questions from ${collectionPath}`
        );

        const domainQuestions = await getQuestionsFromCollection(
          collectionPath,
          domain.count,
          domain.difficulty
        );

        console.log(
          `📊 Actually got ${domainQuestions.length} questions from ${domain.domain}`
        );
        technicalQuestions.push(...domainQuestions);
      }

      // Log technical question summary
      console.log(`🔢 Technical Questions Summary:`);
      console.log(
        `  - Total requested: ${distribution.technicalDomains.reduce(
          (sum, d) => sum + d.count,
          0
        )}`
      );
      console.log(`  - Total collected: ${technicalQuestions.length}`);

      // Fetch qualitative questions based on AI distribution
      for (const cluster of distribution.qualitativeClusters) {
        const clusterPath = `questions/qualitative/${cluster.cluster}`;
        console.log(
          `🧠 Fetching ${cluster.count} questions from ${clusterPath}`
        );

        const clusterQuestions = await getQuestionsFromCollection(
          clusterPath,
          cluster.count
        );

        console.log(
          `📊 Actually got ${clusterQuestions.length} questions from ${cluster.cluster}`
        );
        qualitativeQuestions.push(...clusterQuestions);
      }

      // Log qualitative question summary
      console.log(`🔢 Qualitative Questions Summary:`);
      console.log(
        `  - Total requested: ${distribution.qualitativeClusters.reduce(
          (sum, c) => sum + c.count,
          0
        )}`
      );
      console.log(`  - Total collected: ${qualitativeQuestions.length}`);
    } else {
      console.log("🔄 Using rule-based question selection (AI failed)");

      // Fallback to rule-based selection (existing logic)
      switch (intent) {
        case "confused": {
          const selectedDomains = shuffleArray(explorationDomains).slice(0, 3);
          const questionsPerDomain = Math.floor(40 / selectedDomains.length);

          for (const domain of selectedDomains) {
            const domainQuestions = await getQuestionsFromCollection(
              `questions/technical/${domain}`,
              questionsPerDomain
            );
            technicalQuestions.push(...domainQuestions);
          }

          if (technicalQuestions.length < 40) {
            const extraDomain = explorationDomains.find(
              (d) => !selectedDomains.includes(d)
            );
            if (extraDomain) {
              const extra = await getQuestionsFromCollection(
                `questions/technical/${extraDomain}`,
                40 - technicalQuestions.length
              );
              technicalQuestions.push(...extra);
            }
          }
          break;
        }

        case "interested": {
          const questionsPerRole = Math.floor(40 / target_roles.length);

          for (const role of target_roles) {
            const collection = roleToCollection[role];
            if (collection) {
              const roleQuestions = await getQuestionsFromCollection(
                `questions/technical/${collection}`,
                questionsPerRole
              );
              technicalQuestions.push(...roleQuestions);
            }
          }
          break;
        }

        case "grow": {
          if (!current_role) break;

          const collection = roleToCollection[current_role];
          if (!collection) break;

          const difficultyDist = experienceDifficultyMap[
            experience as keyof typeof experienceDifficultyMap
          ] || {
            easy: 15,
            Medium: 20,
            Hard: 5,
          };

          technicalQuestions = await getQuestionsFromCollection(
            `questions/technical/${collection}`,
            40,
            difficultyDist
          );
          break;
        }

        case "switch": {
          if (current_role) {
            const currentCollection = roleToCollection[current_role];
            if (currentCollection) {
              const currentQuestions = await getQuestionsFromCollection(
                `questions/technical/${currentCollection}`,
                20
              );
              technicalQuestions.push(...currentQuestions);
            }
          }

          const remainingQuestions = 40 - technicalQuestions.length;
          const questionsPerTarget = Math.floor(
            remainingQuestions / target_roles.length
          );

          for (const role of target_roles) {
            const collection = roleToCollection[role];
            if (collection) {
              const targetQuestions = await getQuestionsFromCollection(
                `questions/technical/${collection}`,
                questionsPerTarget
              );
              technicalQuestions.push(...targetQuestions);
            }
          }
          break;
        }
      }

      // Rule-based qualitative selection
      const qualitativeMapping = intentQualitativeMapping[intent];
      if (qualitativeMapping) {
        const { clusters, distribution } = qualitativeMapping;

        for (let i = 0; i < clusters.length; i++) {
          const cluster = clusters[i];
          const count = distribution[i];

          const clusterQuestions = await getQuestionsFromCollection(
            `questions/qualitative/${cluster}`,
            count
          );
          qualitativeQuestions.push(...clusterQuestions);
        }
      }
    }

    // IMPROVED: Better final adjustment logic
    console.log(
      `🎯 Pre-adjustment counts: Technical=${technicalQuestions.length}, Qualitative=${qualitativeQuestions.length}`
    );

    // If we still don't have enough technical questions, try to fetch more from any available collection
    if (technicalQuestions.length < 40) {
      const shortfall = 40 - technicalQuestions.length;
      console.log(
        `⚠️ Technical shortfall: ${shortfall} questions. Attempting to fill from available collections...`
      );

      // Try to get more questions from the most popular collections
      const fallbackCollections = [
        "Engineering_Development_Software_engineer_or_developer",
        "Product_Management_Business_Analyst",
        "Design_and_User_Experience_UX_Designer",
        "Data_Science_and_Analytics_Data_scientist",
      ];

      for (const collection of fallbackCollections) {
        if (technicalQuestions.length >= 40) break;

        const needed = 40 - technicalQuestions.length;
        console.log(
          `🔄 Trying to get ${needed} more questions from ${collection}`
        );

        const additionalQuestions = await getQuestionsFromCollection(
          `questions/technical/${collection}`,
          needed * 2 // Get extra to avoid duplicates
        );

        // Filter out duplicates
        const existingIds = new Set(technicalQuestions.map((q) => q.id));
        const newQuestions = additionalQuestions.filter(
          (q) => !existingIds.has(q.id)
        );

        technicalQuestions.push(...newQuestions.slice(0, needed));
        console.log(
          `➕ Added ${Math.min(
            newQuestions.length,
            needed
          )} questions from ${collection}`
        );
      }
    }

    // If we still don't have enough qualitative questions, do the same
    if (qualitativeQuestions.length < 29) {
      const shortfall = 29 - qualitativeQuestions.length;
      console.log(
        `⚠️ Qualitative shortfall: ${shortfall} questions. Attempting to fill...`
      );

      const fallbackClusters = [
        "Self-Awareness_And_Growth-Mindset",
        "Collaboration_And_Social-Intelligence",
        "Resilience_And_Self-Regulation",
      ];

      for (const cluster of fallbackClusters) {
        if (qualitativeQuestions.length >= 29) break;

        const needed = 29 - qualitativeQuestions.length;
        const additionalQuestions = await getQuestionsFromCollection(
          `questions/qualitative/${cluster}`,
          needed * 2
        );

        const existingIds = new Set(qualitativeQuestions.map((q) => q.id));
        const newQuestions = additionalQuestions.filter(
          (q) => !existingIds.has(q.id)
        );

        qualitativeQuestions.push(...newQuestions.slice(0, needed));
        console.log(
          `➕ Added ${Math.min(
            newQuestions.length,
            needed
          )} qualitative questions from ${cluster}`
        );
      }
    }

    // Final counts (keep the existing slice logic as final safety)
    technicalQuestions = technicalQuestions.slice(0, 40);
    qualitativeQuestions = qualitativeQuestions.slice(0, 29);

    console.log(
      `✅ Final question counts: Technical=${technicalQuestions.length}/40, Qualitative=${qualitativeQuestions.length}/29`
    );

    console.log(
      `Selected ${technicalQuestions.length} technical and ${qualitativeQuestions.length} qualitative questions`
    );

    // Combine all questions
    const allQuestions = [...technicalQuestions, ...qualitativeQuestions];

    // Add metadata to help with analysis
    const metadata = {
      intent,
      totalQuestions: allQuestions.length,
      technicalCount: technicalQuestions.length,
      qualitativeCount: qualitativeQuestions.length,
      technicalBreakdown: {
        byLevel: {
          easy: technicalQuestions.filter((q) => q.level === "easy").length,
          Medium: technicalQuestions.filter((q) => q.level === "Medium").length,
          Hard: technicalQuestions.filter((q) => q.level === "Hard").length,
        },
        byRole: target_roles || [current_role].filter(Boolean),
      },
      qualitativeBreakdown: {
        clusters:
          distribution?.qualitativeClusters?.map((c) => c.cluster) ||
          intentQualitativeMapping[intent]?.clusters ||
          [],
      },
      aiOptimized: !!distribution,
      focusAreas: distribution?.focusAreas,
      difficultyStrategy: distribution?.difficultyStrategy,
      usedAI: !!distribution,
    };

    console.log("📊 Final Results:");
    console.log(`- AI Optimized: ${!!distribution ? "✅ YES" : "❌ NO"}`);
    console.log(`- Total Questions: ${allQuestions.length}`);
    console.log(`- Technical: ${technicalQuestions.length}`);
    console.log(`- Qualitative: ${qualitativeQuestions.length}`);

    return NextResponse.json({
      questions: allQuestions,
      metadata,
      success: true,
    });
  } catch (error) {
    console.error("Error in intent-based question selection:", error);
    return NextResponse.json(
      {
        error: "Failed to select questions",
        questions: [],
        metadata: {},
        success: false,
      },
      { status: 500 }
    );
  }
}
