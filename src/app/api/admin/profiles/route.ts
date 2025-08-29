/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/admin/profiles/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import adminDb from "../../../lib/firebase/admin";
import { Session } from "next-auth";

export async function GET(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as Session;

    // Check if user is admin
    if (!session || !session.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search");

    const query = adminDb.collection("profiles").orderBy("createdAt", "desc");

    const profilesSnapshot = await query.limit(limit).get();

    const profiles = profilesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        email: data.email,
        age_group: data.age_group,
        education: data.education,
        experience: data.experience,
        purpose: data.purpose,
        functional_area: data.functional_area,
        roles: data.roles,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      };
    });

    // Filtered by search term if provided (client-side filtering for now)
    const filteredProfiles = search
      ? profiles.filter(
          (p) =>
            p.email?.toLowerCase().includes(search.toLowerCase()) ||
            p.functional_area?.toLowerCase().includes(search.toLowerCase()) ||
            p.roles?.toLowerCase().includes(search.toLowerCase())
        )
      : profiles;

    // Get total count
    const totalSnapshot = await adminDb.collection("profiles").count().get();
    const total = totalSnapshot.data().count;

    // Calculate profile statistics
    const stats = {
      totalProfiles: total,
      byEducation: {} as Record<string, number>,
      byExperience: {} as Record<string, number>,
      byFunctionalArea: {} as Record<string, number>,
      byAgeGroup: {} as Record<string, number>,
    };

    // Group profiles by different categories
    profiles.forEach((profile) => {
      stats.byEducation[profile.education] =
        (stats.byEducation[profile.education] || 0) + 1;

      stats.byExperience[profile.experience] =
        (stats.byExperience[profile.experience] || 0) + 1;

      stats.byFunctionalArea[profile.functional_area] =
        (stats.byFunctionalArea[profile.functional_area] || 0) + 1;

      stats.byAgeGroup[profile.age_group] =
        (stats.byAgeGroup[profile.age_group] || 0) + 1;
    });

    return NextResponse.json({
      profiles: filteredProfiles,
      total,
      stats,
    });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return NextResponse.json(
      { error: "Failed to fetch profiles" },
      { status: 500 }
    );
  }
}
