/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// api/profile/route.ts - Updated to handle new intent-based fields

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import adminDb from "../../lib/firebase/admin";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profileDoc = await adminDb
      .collection("profiles")
      .doc(session.user.email)
      .get();

    if (!profileDoc.exists) {
      return NextResponse.json({ profile: null });
    }

    const profileData = profileDoc.data();

    // Handle backward compatibility - migrate old 'roles' field to new structure
    if (profileData?.roles && !profileData.current_role) {
      profileData.current_role = profileData.roles;
      profileData.target_roles = [];
    }

    return NextResponse.json({ profile: profileData });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "age_group",
      "education",
      "experience",
      "purpose",
      "functional_area",
      "current_role",
      "target_roles",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate target_roles is an array
    if (!Array.isArray(body.target_roles)) {
      return NextResponse.json(
        { error: "target_roles must be an array" },
        { status: 400 }
      );
    }

    // Validate target_roles has at least one selection
    if (body.target_roles.length === 0) {
      return NextResponse.json(
        { error: "Please select at least one target role" },
        { status: 400 }
      );
    }

    // Validate target_roles has maximum 3 selections
    if (body.target_roles.length > 3) {
      return NextResponse.json(
        { error: "Please select maximum 3 target roles" },
        { status: 400 }
      );
    }

    type ProfileData = {
      age_group: any;
      education: any;
      experience: any;
      purpose: any;
      functional_area: any;
      current_role: any;
      target_roles: any;
      roles: any;
      updatedAt: Date;
      email: string;
      userId: string;
      createdAt?: Date;
    };

    const profileData: ProfileData = {
      age_group: body.age_group,
      education: body.education,
      experience: body.experience,
      purpose: body.purpose,
      functional_area: body.functional_area,
      current_role:
        body.current_role === "None / Not Currently in IT"
          ? null
          : body.current_role,
      target_roles: body.target_roles,
      // Keep old field for backward compatibility temporarily
      roles:
        body.current_role === "None / Not Currently in IT"
          ? body.target_roles[0]
          : body.current_role,
      updatedAt: new Date(),
      email: session.user.email,
      userId: session.user.id || session.user.email,
    };

    // Check if this is first profile creation
    const existingProfile = await adminDb
      .collection("profiles")
      .doc(session.user.email)
      .get();

    if (!existingProfile.exists) {
      profileData.createdAt = new Date();
    }

    // Save profile
    await adminDb
      .collection("profiles")
      .doc(session.user.email)
      .set(profileData, { merge: true });

    return NextResponse.json({
      success: true,
      message: "Profile saved successfully",
      profile: profileData,
    });
  } catch (error) {
    console.error("Error saving profile:", error);
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }
}
