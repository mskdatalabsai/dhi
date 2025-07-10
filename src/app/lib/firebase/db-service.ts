/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/firebase/db-service.ts
import adminDb from "./admin";
import bcrypt from "bcryptjs";

// Updated User interface with payment properties
export interface User {
  id?: string;
  email: string;
  password: string;
  name: string;
  role: string;
  provider?: string;
  hasPaid?: boolean; // Payment status
  paymentDate?: Date; // When payment was made
  paymentId?: string; // Razorpay payment ID
  createdAt: Date;
  updatedAt: Date;
}

// New Payment interface
export interface Payment {
  id?: string;
  userEmail: string;
  userId: string;
  paymentId: string; // Razorpay payment ID
  orderId?: string; // Razorpay order ID
  signature?: string; // Razorpay signature
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

export const firestoreDb = {
  users: {
    findByEmail: async (email: string): Promise<User | null> => {
      try {
        const usersRef = adminDb.collection("users");
        const snapshot = await usersRef
          .where("email", "==", email)
          .limit(1)
          .get();

        if (snapshot.empty) return null;

        const doc = snapshot.docs[0];
        const data = doc.data();

        return {
          id: doc.id,
          email: data.email,
          password: data.password,
          name: data.name,
          role: data.role,
          provider: data.provider,
          hasPaid: data.hasPaid,
          paymentDate: data.paymentDate?.toDate
            ? data.paymentDate.toDate()
            : data.paymentDate
            ? new Date(data.paymentDate)
            : undefined,
          paymentId: data.paymentId,
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate()
            : new Date(data.createdAt),
          updatedAt: data.updatedAt?.toDate
            ? data.updatedAt.toDate()
            : new Date(data.updatedAt),
        };
      } catch (error) {
        console.error("Error finding user by email:", error);
        return null;
      }
    },

    findById: async (id: string): Promise<User | null> => {
      try {
        const doc = await adminDb.collection("users").doc(id).get();
        if (!doc.exists) return null;

        const data = doc.data()!;
        return {
          id: doc.id,
          email: data.email,
          password: data.password,
          name: data.name,
          role: data.role,
          provider: data.provider,
          hasPaid: data.hasPaid,
          paymentDate: data.paymentDate?.toDate
            ? data.paymentDate.toDate()
            : data.paymentDate
            ? new Date(data.paymentDate)
            : undefined,
          paymentId: data.paymentId,
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate()
            : new Date(data.createdAt),
          updatedAt: data.updatedAt?.toDate
            ? data.updatedAt.toDate()
            : new Date(data.updatedAt),
        };
      } catch (error) {
        console.error("Error finding user by ID:", error);
        return null;
      }
    },

    create: async (
      userData: Omit<User, "id" | "createdAt" | "updatedAt">
    ): Promise<User> => {
      try {
        const now = new Date();
        const newUser = {
          ...userData,
          createdAt: now,
          updatedAt: now,
        };
        const docRef = await adminDb.collection("users").add(newUser);
        return {
          id: docRef.id,
          ...newUser,
        };
      } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user");
      }
    },

    exists: async (email: string): Promise<boolean> => {
      try {
        const user = await firestoreDb.users.findByEmail(email);
        return user !== null;
      } catch (error) {
        console.error("Error checking user existence:", error);
        return false;
      }
    },

    update: async (id: string, data: Partial<User>): Promise<void> => {
      try {
        await adminDb
          .collection("users")
          .doc(id)
          .update({
            ...data,
            updatedAt: new Date(),
          });
      } catch (error) {
        console.error("Error updating user:", error);
        throw new Error("Failed to update user");
      }
    },

    delete: async (id: string): Promise<void> => {
      try {
        await adminDb.collection("users").doc(id).delete();
      } catch (error) {
        console.error("Error deleting user:", error);
        throw new Error("Failed to delete user");
      }
    },

    verifyPassword: async (
      plainPassword: string,
      hashedPassword: string
    ): Promise<boolean> => {
      return bcrypt.compare(plainPassword, hashedPassword);
    },

    hashPassword: async (password: string): Promise<string> => {
      return bcrypt.hash(password, 10);
    },

    getAll: async (limit: number = 100): Promise<User[]> => {
      try {
        const snapshot = await adminDb
          .collection("users")
          .orderBy("createdAt", "desc")
          .limit(limit)
          .get();

        return snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            email: data.email,
            password: data.password,
            name: data.name,
            role: data.role,
            provider: data.provider,
            hasPaid: data.hasPaid,
            paymentDate: data.paymentDate?.toDate
              ? data.paymentDate.toDate()
              : data.paymentDate
              ? new Date(data.paymentDate)
              : undefined,
            paymentId: data.paymentId,
            createdAt: data.createdAt?.toDate
              ? data.createdAt.toDate()
              : new Date(data.createdAt),
            updatedAt: data.updatedAt?.toDate
              ? data.updatedAt.toDate()
              : new Date(data.updatedAt),
          };
        });
      } catch (error) {
        console.error("Error getting all users:", error);
        return [];
      }
    },

    // New payment-related methods
    markAsPaid: async (
      userId: string,
      paymentData: { paymentId: string }
    ): Promise<void> => {
      try {
        await adminDb.collection("users").doc(userId).update({
          hasPaid: true,
          paymentDate: new Date(),
          paymentId: paymentData.paymentId,
          updatedAt: new Date(),
        });
      } catch (error) {
        console.error("Error marking user as paid:", error);
        throw new Error("Failed to mark user as paid");
      }
    },

    checkPaymentStatus: async (userEmail: string): Promise<boolean> => {
      try {
        const user = await firestoreDb.users.findByEmail(userEmail);
        return user?.hasPaid === true;
      } catch (error) {
        console.error("Error checking user payment status:", error);
        return false;
      }
    },
  },

  // New payments collection
  payments: {
    create: async (
      paymentData: Omit<Payment, "id" | "createdAt" | "updatedAt">
    ): Promise<Payment> => {
      try {
        const now = new Date();
        const newPayment = {
          ...paymentData,
          createdAt: now,
          updatedAt: now,
        };

        const docRef = await adminDb.collection("payments").add(newPayment);

        return {
          id: docRef.id,
          ...newPayment,
        };
      } catch (error) {
        console.error("Error creating payment record:", error);
        throw new Error("Failed to create payment record");
      }
    },

    findByUserEmail: async (userEmail: string): Promise<Payment[]> => {
      try {
        const snapshot = await adminDb
          .collection("payments")
          .where("userEmail", "==", userEmail)
          .orderBy("createdAt", "desc")
          .get();

        return snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            userEmail: data.userEmail,
            userId: data.userId,
            paymentId: data.paymentId,
            orderId: data.orderId,
            signature: data.signature,
            amount: data.amount,
            currency: data.currency,
            status: data.status,
            createdAt: data.createdAt?.toDate
              ? data.createdAt.toDate()
              : new Date(data.createdAt),
            updatedAt: data.updatedAt?.toDate
              ? data.updatedAt.toDate()
              : new Date(data.updatedAt),
          };
        });
      } catch (error) {
        console.error("Error finding payments by user email:", error);
        return [];
      }
    },

    findByPaymentId: async (paymentId: string): Promise<Payment | null> => {
      try {
        const snapshot = await adminDb
          .collection("payments")
          .where("paymentId", "==", paymentId)
          .limit(1)
          .get();

        if (snapshot.empty) return null;

        const doc = snapshot.docs[0];
        const data = doc.data();

        return {
          id: doc.id,
          userEmail: data.userEmail,
          userId: data.userId,
          paymentId: data.paymentId,
          orderId: data.orderId,
          signature: data.signature,
          amount: data.amount,
          currency: data.currency,
          status: data.status,
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate()
            : new Date(data.createdAt),
          updatedAt: data.updatedAt?.toDate
            ? data.updatedAt.toDate()
            : new Date(data.updatedAt),
        };
      } catch (error) {
        console.error("Error finding payment by payment ID:", error);
        return null;
      }
    },

    hasUserPaid: async (userEmail: string): Promise<boolean> => {
      try {
        // Check for completed payments
        const snapshot = await adminDb
          .collection("payments")
          .where("userEmail", "==", userEmail)
          .where("status", "==", "completed")
          .limit(1)
          .get();

        return !snapshot.empty;
      } catch (error) {
        console.error("Error checking if user has paid:", error);
        return false;
      }
    },

    updateStatus: async (
      paymentId: string,
      status: Payment["status"]
    ): Promise<void> => {
      try {
        const snapshot = await adminDb
          .collection("payments")
          .where("paymentId", "==", paymentId)
          .limit(1)
          .get();

        if (!snapshot.empty) {
          const docId = snapshot.docs[0].id;
          await adminDb.collection("payments").doc(docId).update({
            status,
            updatedAt: new Date(),
          });
        }
      } catch (error) {
        console.error("Error updating payment status:", error);
        throw new Error("Failed to update payment status");
      }
    },

    getAll: async (limit: number = 100): Promise<Payment[]> => {
      try {
        const snapshot = await adminDb
          .collection("payments")
          .orderBy("createdAt", "desc")
          .limit(limit)
          .get();

        return snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            userEmail: data.userEmail,
            userId: data.userId,
            paymentId: data.paymentId,
            orderId: data.orderId,
            signature: data.signature,
            amount: data.amount,
            currency: data.currency,
            status: data.status,
            createdAt: data.createdAt?.toDate
              ? data.createdAt.toDate()
              : new Date(data.createdAt),
            updatedAt: data.updatedAt?.toDate
              ? data.updatedAt.toDate()
              : new Date(data.updatedAt),
          };
        });
      } catch (error) {
        console.error("Error getting all payments:", error);
        return [];
      }
    },
  },

  surveyResults: {
    save: async (surveyData: any): Promise<string> => {
      try {
        const docRef = await adminDb.collection("surveyResults").add({
          ...surveyData,
          createdAt: new Date(),
        });
        return docRef.id;
      } catch (error) {
        console.error("Error saving survey results:", error);
        throw new Error("Failed to save survey results");
      }
    },

    getUserResults: async (userId: string): Promise<any[]> => {
      try {
        const snapshot = await adminDb
          .collection("surveyResults")
          .where("userId", "==", userId)
          .orderBy("submittedAt", "desc")
          .get();

        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error getting user survey results:", error);
        return [];
      }
    },

    getAll: async (limit: number = 100): Promise<any[]> => {
      try {
        const snapshot = await adminDb
          .collection("surveyResults")
          .orderBy("submittedAt", "desc")
          .limit(limit)
          .get();

        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          submittedAt: doc.data().submittedAt?.toDate
            ? doc.data().submittedAt.toDate()
            : new Date(doc.data().submittedAt),
        }));
      } catch (error) {
        console.error("Error getting all survey results:", error);
        return [];
      }
    },

    getById: async (surveyId: string): Promise<any | null> => {
      try {
        const doc = await adminDb
          .collection("surveyResults")
          .doc(surveyId)
          .get();
        if (!doc.exists) return null;

        return {
          id: doc.id,
          ...doc.data(),
        };
      } catch (error) {
        console.error("Error getting survey result by ID:", error);
        return null;
      }
    },
  },

  profiles: {
    createOrUpdate: async (
      userId: string,
      profileData: any
    ): Promise<string> => {
      try {
        const profilesRef = adminDb.collection("profiles");
        const existingProfile = await profilesRef
          .where("userId", "==", userId)
          .limit(1)
          .get();

        if (!existingProfile.empty) {
          const docId = existingProfile.docs[0].id;
          await profilesRef.doc(docId).update({
            ...profileData,
            updatedAt: new Date(),
          });
          return docId;
        } else {
          const docRef = await profilesRef.add({
            userId,
            ...profileData,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          return docRef.id;
        }
      } catch (error) {
        console.error("Error saving profile:", error);
        throw new Error("Failed to save profile");
      }
    },

    getByUserId: async (userId: string): Promise<any | null> => {
      try {
        const snapshot = await adminDb
          .collection("profiles")
          .where("userId", "==", userId)
          .limit(1)
          .get();
        if (snapshot.empty) return null;

        return {
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data(),
        };
      } catch (error) {
        console.error("Error getting profile:", error);
        return null;
      }
    },

    getAll: async (limit: number = 100): Promise<any[]> => {
      try {
        const snapshot = await adminDb
          .collection("profiles")
          .orderBy("createdAt", "desc")
          .limit(limit)
          .get();

        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error getting all profiles:", error);
        return [];
      }
    },
  },
};
