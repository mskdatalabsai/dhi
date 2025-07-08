/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import adminDb from "../../../lib/firebase/admin";
import { Session } from "next-auth";

export async function POST(request: NextRequest) {
  try {
    const session: Session | null = await getServerSession(authOptions);
    if (!session || !session.user?.id || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profileData = await request.json();

    const requiredFields = [
      "age_group",
      "education",
      "experience",
      "purpose",
      "functional_area",
      "roles",
    ];

    for (const field of requiredFields) {
      if (!profileData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const profileDoc = {
      userId: session.user.id,
      email: session.user.email,
      ...profileData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const profilesRef = adminDb.collection("profiles");
    const existingProfile = await profilesRef
      .where("userId", "==", session.user.id)
      .limit(1)
      .get();

    let profileId;
    if (!existingProfile.empty) {
      profileId = existingProfile.docs[0].id;
      await profilesRef.doc(profileId).update({
        ...profileData,
        updatedAt: new Date(),
      });
    } else {
      const docRef = await profilesRef.add(profileDoc);
      profileId = docRef.id;
    }

    return NextResponse.json({
      success: true,
      profileId,
      message: "Profile saved successfully",
    });
  } catch (error) {
    console.error("Error saving profile:", error);
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session: Session | null = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profilesRef = adminDb.collection("profiles");
    const profileSnapshot = await profilesRef
      .where("userId", "==", session.user.id)
      .limit(1)
      .get();

    if (profileSnapshot.empty) {
      return NextResponse.json({ profile: null });
    }

    const profile = {
      id: profileSnapshot.docs[0].id,
      ...profileSnapshot.docs[0].data(),
    };

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
