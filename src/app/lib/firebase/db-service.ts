/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/firebase/db-service.ts
import adminDb from "./admin";
import bcrypt from "bcryptjs";

export interface User {
  id?: string;
  email: string;
  password: string;
  name: string;
  role: string;
  provider?: string;
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
