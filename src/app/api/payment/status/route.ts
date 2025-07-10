/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/payment/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import { firestoreDb } from "../../../lib/firebase/db-service";
import adminDb from "../../../lib/firebase/admin";

export async function GET(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - Please login first" },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

    // Check payment status in Firebase
    const hasPaid = await checkPaymentStatus(userEmail);

    return NextResponse.json({
      hasPaid,
      userEmail,
    });
  } catch (error) {
    console.error("Error checking payment status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Record payment after successful Razorpay payment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - Please login first" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;

    if (!razorpay_payment_id) {
      return NextResponse.json(
        { error: "Missing payment information" },
        { status: 400 }
      );
    }

    const userEmail = session.user.email;
    const userId = session.user.id || session.user.email;

    // Record payment in Firebase
    const success = await recordPayment(userEmail, userId, {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    });

    if (success) {
      return NextResponse.json({
        success: true,
        message: "Payment recorded successfully",
        redirect: "/profile",
      });
    } else {
      return NextResponse.json(
        { error: "Failed to record payment" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error recording payment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Check if user has paid by looking in payments collection and user document
async function checkPaymentStatus(userEmail: string): Promise<boolean> {
  try {
    // Method 1: Check payments collection
    const paymentsSnapshot = await adminDb
      .collection("payments")
      .where("userEmail", "==", userEmail)
      .where("status", "==", "completed")
      .limit(1)
      .get();

    if (!paymentsSnapshot.empty) {
      return true;
    }

    // Method 2: Check user document for hasPaid flag
    const user = await firestoreDb.users.findByEmail(userEmail);
    if (user) {
      // Type assertion to access custom property
      const userWithPayment = user as any;
      return userWithPayment.hasPaid === true;
    }

    return false;
  } catch (error) {
    console.error("Error checking payment status:", error);
    return false;
  }
}

// Record payment in both payments collection and update user document
async function recordPayment(
  userEmail: string,
  userId: string,
  paymentData: {
    razorpay_payment_id: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  }
): Promise<boolean> {
  try {
    const now = new Date();

    // 1. Create payment record
    await adminDb.collection("payments").add({
      userEmail,
      userId,
      paymentId: paymentData.razorpay_payment_id,
      orderId: paymentData.razorpay_order_id || "",
      signature: paymentData.razorpay_signature || "",
      amount: 99,
      currency: "INR",
      status: "completed",
      createdAt: now,
      updatedAt: now,
    });

    // 2. Update user document to mark as paid
    const user = await firestoreDb.users.findByEmail(userEmail);
    if (user?.id) {
      await firestoreDb.users.update(user.id, {
        hasPaid: true,
        paymentDate: now,
        paymentId: paymentData.razorpay_payment_id,
      } as any); // Type assertion for custom properties
    }

    console.log(
      `✅ Payment recorded for ${userEmail}: ${paymentData.razorpay_payment_id}`
    );
    return true;
  } catch (error) {
    console.error("❌ Error recording payment:", error);
    return false;
  }
}
