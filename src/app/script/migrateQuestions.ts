// scripts/migrateQuestions.ts
// Run with: npx ts-node scripts/migrateQuestions.ts

import adminDb from "../lib/firebase/admin";
import {
  roleToCollection,
  qualitativeClusters,
} from "../lib/config/roleMapping";

interface Question {
  functionalArea: string;
  roleTitle: string;
  questionId: string;
  question: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correctOption: string;
  level: "easy" | "medium" | "advanced";
  caseId?: string;
}

// Mapping of functional areas to determine if question is qualitative
const qualitativeIndicators = [
  "cognitive",
  "agility",
  "self-awareness",
  "growth",
  "mindset",
  "collaboration",
  "social",
  "intelligence",
  "leadership",
  "ownership",
  "values",
  "work-ethic",
  "ethics",
  "resilience",
  "self-regulation",
];

function isQualitativeQuestion(question: Question): boolean {
  const lowerQuestion = question.question.toLowerCase();
  const lowerCategory = (question.functionalArea || "").toLowerCase();

  return qualitativeIndicators.some(
    (indicator) =>
      lowerQuestion.includes(indicator) || lowerCategory.includes(indicator)
  );
}

function getQualitativeCluster(question: Question): string | null {
  const lowerQuestion = question.question.toLowerCase();
  const lowerCategory = (question.functionalArea || "").toLowerCase();
  const combined = `${lowerQuestion} ${lowerCategory}`;

  if (combined.includes("cognitive") || combined.includes("agility")) {
    return qualitativeClusters.cognitive;
  }
  if (
    combined.includes("self-awareness") ||
    combined.includes("growth") ||
    combined.includes("mindset")
  ) {
    return qualitativeClusters.growth;
  }
  if (combined.includes("collaboration") || combined.includes("social")) {
    return qualitativeClusters.collaboration;
  }
  if (combined.includes("leadership") || combined.includes("ownership")) {
    return qualitativeClusters.leadership;
  }
  if (
    combined.includes("values") ||
    combined.includes("ethics") ||
    combined.includes("work-ethic")
  ) {
    return qualitativeClusters.ethics;
  }
  if (combined.includes("resilience") || combined.includes("self-regulation")) {
    return qualitativeClusters.resilience;
  }

  return null;
}

async function migrateQuestions() {
  console.log(
    "🚀 Starting question migration from case-based to role-based structure..."
  );

  try {
    // Step 1: Read all questions from all cases
    const allQuestions: Question[] = [];

    for (let caseNum = 1; caseNum <= 10; caseNum++) {
      const caseId = `case_${caseNum}`;
      console.log(`\n📦 Reading questions from ${caseId}...`);

      const snapshot = await adminDb
        .collection("questions")
        .where("caseId", "==", caseId)
        .get();

      console.log(`Found ${snapshot.size} questions in ${caseId}`);

      snapshot.forEach((doc) => {
        const data = doc.data() as Question;
        allQuestions.push({ ...data, caseId });
      });
    }

    console.log(`\n📊 Total questions collected: ${allQuestions.length}`);

    // Step 2: Separate technical and qualitative questions
    const technicalQuestions: Map<string, Question[]> = new Map();
    const qualitativeQuestions: Map<string, Question[]> = new Map();

    allQuestions.forEach((question) => {
      if (isQualitativeQuestion(question)) {
        // Qualitative question
        const cluster = getQualitativeCluster(question);
        if (cluster) {
          if (!qualitativeQuestions.has(cluster)) {
            qualitativeQuestions.set(cluster, []);
          }
          qualitativeQuestions.get(cluster)!.push(question);
        }
      } else {
        // Technical question
        const roleCollection = roleToCollection[question.roleTitle];
        if (roleCollection) {
          if (!technicalQuestions.has(roleCollection)) {
            technicalQuestions.set(roleCollection, []);
          }
          technicalQuestions.get(roleCollection)!.push(question);
        } else {
          console.warn(`⚠️  No mapping found for role: ${question.roleTitle}`);
        }
      }
    });

    console.log("\n📈 Question distribution:");
    console.log(`Technical collections: ${technicalQuestions.size}`);
    console.log(`Qualitative clusters: ${qualitativeQuestions.size}`);

    // Step 3: Create new collection structure and upload questions
    const batch = adminDb.batch();
    let batchCount = 0;
    const MAX_BATCH_SIZE = 500;

    // Upload technical questions
    console.log("\n📤 Uploading technical questions...");
    for (const [collection, questions] of technicalQuestions.entries()) {
      console.log(`\nProcessing ${collection}: ${questions.length} questions`);

      for (const question of questions) {
        const docRef = adminDb
          .collection(`questions/technical/${collection}`)
          .doc(); // Auto-generate ID

        batch.set(docRef, {
          ...question,
          collection,
          migratedAt: new Date(),
          originalCaseId: question.caseId,
        });

        batchCount++;

        if (batchCount >= MAX_BATCH_SIZE) {
          await batch.commit();
          console.log(`✅ Committed batch of ${batchCount} documents`);
          batchCount = 0;
        }
      }
    }

    // Upload qualitative questions
    console.log("\n📤 Uploading qualitative questions...");
    for (const [cluster, questions] of qualitativeQuestions.entries()) {
      console.log(`\nProcessing ${cluster}: ${questions.length} questions`);

      for (const question of questions) {
        const docRef = adminDb
          .collection(`questions/qualitative/${cluster}`)
          .doc(); // Auto-generate ID

        batch.set(docRef, {
          ...question,
          cluster,
          migratedAt: new Date(),
          originalCaseId: question.caseId,
        });

        batchCount++;

        if (batchCount >= MAX_BATCH_SIZE) {
          await batch.commit();
          console.log(`✅ Committed batch of ${batchCount} documents`);
          batchCount = 0;
        }
      }
    }

    // Commit any remaining documents
    if (batchCount > 0) {
      await batch.commit();
      console.log(`✅ Committed final batch of ${batchCount} documents`);
    }

    // Step 4: Generate migration report
    console.log("\n📊 Migration Summary:");
    console.log("=".repeat(50));
    console.log(`Total questions migrated: ${allQuestions.length}`);
    console.log("\nTechnical Questions by Role:");
    for (const [collection, questions] of technicalQuestions.entries()) {
      const byLevel = {
        easy: questions.filter((q) => q.level === "easy").length,
        medium: questions.filter((q) => q.level === "medium").length,
        advanced: questions.filter((q) => q.level === "advanced").length,
      };
      console.log(`  ${collection}: ${questions.length} total`);
      console.log(
        `    - Easy: ${byLevel.easy}, Medium: ${byLevel.medium}, Advanced: ${byLevel.advanced}`
      );
    }

    console.log("\nQualitative Questions by Cluster:");
    for (const [cluster, questions] of qualitativeQuestions.entries()) {
      console.log(`  ${cluster}: ${questions.length} questions`);
    }

    console.log("\n✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

// Run migration
migrateQuestions()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Migration error:", error);
    process.exit(1);
  });
