// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { firestoreDb } from "../../../lib/firebase/db-service";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists in Firebase
    const existingUser = await firestoreDb.users.exists(email);
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await firestoreDb.users.hashPassword(password);

    // Create user in Firebase Firestore
    const newUser = await firestoreDb.users.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    // Return success (don't send password back)
    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
