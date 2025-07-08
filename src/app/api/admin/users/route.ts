// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import { firestoreDb } from "../../../lib/firebase/db-service";

// Middleware to check if user is admin
import { Session } from "next-auth";

async function isAdmin() {
  const session = (await getServerSession(authOptions)) as Session & {
    user?: { role?: string };
  };
  if (!session || session.user?.role !== "admin") {
    return false;
  }
  return true;
}

// GET all users
export async function GET(request: NextRequest) {
  try {
    // Check admin permission
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "100");
    const search = searchParams.get("search") || "";

    // Get all users
    const users = await firestoreDb.users.getAll(limit);

    // Filter by search term if provided
    const filteredUsers = search
      ? users.filter(
          (user) =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
        )
      : users;

    // Remove passwords from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const safeUsers = filteredUsers.map(({ password, ...user }) => user);

    return NextResponse.json({
      users: safeUsers,
      total: safeUsers.length,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// DELETE user
export async function DELETE(request: NextRequest) {
  try {
    // Check admin permission
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    await firestoreDb.users.delete(userId);

    return NextResponse.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
