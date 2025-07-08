import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";
import { firestoreDb } from "../../../../lib/firebase/db-service";
import type { Session } from "next-auth";

// Middleware to check if user is admin
async function isAdmin(): Promise<boolean> {
  const session = (await getServerSession(authOptions)) as Session | null;

  if (!session || !session.user || session.user.role !== "admin") {
    return false;
  }
  return true;
}

// GET specific user
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await firestoreDb.users.findById(params.userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...safeUser } = user;

    return NextResponse.json(safeUser);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PUT update user
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updates = await request.json();

    // Don't allow sensitive fields to be updated
    delete updates.password;
    delete updates.id;
    delete updates.createdAt;

    await firestoreDb.users.update(params.userId, updates);

    return NextResponse.json({
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
