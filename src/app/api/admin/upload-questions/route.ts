/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/admin/upload-questions/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import adminDb from "../../../lib/firebase/admin";

// Define admin emails who can upload questions
const ADMIN_EMAILS = ["kotoky10@gmail.com"]; // Update with your admin emails

interface QuestionUpload {
  type: "technical" | "qualitative";
  targetCollection: string;
  questions: any[];
  batchId: string;
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (!ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const body: QuestionUpload = await request.json();
    const { type, targetCollection, questions, batchId } = body;

    // Validate input
    if (!type || !targetCollection || !questions || questions.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log(
      `Uploading ${questions.length} ${type} questions to ${targetCollection}`
    );

    // Determine collection path
    const collectionPath =
      type === "technical"
        ? `questions/technical/${targetCollection}`
        : `questions/qualitative/${targetCollection}`;

    // Upload questions in batches
    let batch = adminDb.batch();
    let uploadedCount = 0;
    let batchCount = 0;
    const results = [];

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const docRef = adminDb.collection(collectionPath).doc();

      batch.set(docRef, {
        ...question,
        uploadedAt: new Date(),
        uploadedBy: session.user.email,
        batchId,
        collectionType: type,
        collection: targetCollection,
      });

      batchCount++;
      uploadedCount++;

      // Commit every 500 documents (Firestore limit)
      if (batchCount === 500) {
        await batch.commit();
        results.push(`Committed batch of ${batchCount} documents`);

        // Create a new batch for the next set of documents
        batch = adminDb.batch();
        batchCount = 0;
      }
    }

    // Commit remaining documents
    if (batchCount > 0) {
      await batch.commit();
      results.push(`Committed final batch of ${batchCount} documents`);
    }

    console.log(
      `Successfully uploaded ${uploadedCount} questions to ${collectionPath}`
    );

    return NextResponse.json({
      success: true,
      message: `Uploaded ${uploadedCount} questions successfully`,
      collection: collectionPath,
      count: uploadedCount,
      batches: results,
    });
  } catch (error) {
    console.error("Error uploading questions:", error);
    return NextResponse.json(
      {
        error: "Failed to upload questions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check if user is admin
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ isAdmin: false });
    }

    const isAdmin = ADMIN_EMAILS.includes(session.user.email);

    return NextResponse.json({
      isAdmin,
      email: session.user.email,
    });
  } catch (error) {
    console.error("Error checking admin status:", error);
    return NextResponse.json({ isAdmin: false });
  }
}
