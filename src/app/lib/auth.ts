/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { JWT } from "next-auth/jwt";
import { firestoreDb } from "./firebase/db-service";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await firestoreDb.users.findByEmail(credentials.email);

        if (!user) {
          throw new Error("User not found");
        }

        const isPasswordValid = await firestoreDb.users.verifyPassword(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id!,
          email: user.email,
          name: user.name,
          role: user.role,
        } as User;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async signIn({ user, account, profile }: any): Promise<boolean> {
      // Only process OAuth sign-ins
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          // Check if user email exists
          if (!user.email) {
            console.error("No email provided by OAuth provider");
            // Still allow sign in, but without Firebase integration
            return true;
          }

          // Try to save to Firebase, but don't block sign in if it fails
          try {
            // Check if user already exists
            const existingUser = await firestoreDb.users.findByEmail(
              user.email
            );

            if (!existingUser) {
              // Create new user in Firebase
              const newUser = await firestoreDb.users.create({
                email: user.email,
                name: user.name || profile?.name || "OAuth User",
                password: await firestoreDb.users.hashPassword(
                  Math.random().toString(36).slice(-8) +
                    Math.random().toString(36).slice(-8)
                ),
                role: "user",
                provider: account.provider,
              });

              // Update the user object with the Firebase user ID
              user.id = newUser.id!;
              user.role = newUser.role;
            } else {
              // User exists, update their info if needed
              user.id = existingUser.id!;
              user.role = existingUser.role;

              // Optionally update user info
              if (user.name && user.name !== existingUser.name) {
                await firestoreDb.users
                  .update(existingUser.id!, {
                    name: user.name,
                  })
                  .catch((err) =>
                    console.error("Failed to update user name:", err)
                  );
              }
            }
          } catch (firebaseError) {
            // Log the error but don't block sign in
            console.error(
              "Firebase integration error (non-blocking):",
              firebaseError
            );
            // Set default values if Firebase fails
            user.id = user.email;
            user.role = "user";
          }
        } catch (error) {
          console.error("Unexpected error in signIn callback:", error);
          // Still allow sign in even if something goes wrong
        }
      }

      return true; // Always allow sign in
    },

    async jwt({
      token,
      user,
      account,
    }: {
      token: JWT;
      user?: User;
      account?: any;
    }): Promise<JWT> {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "user";
      }

      // For OAuth logins, try to fetch user data from Firebase
      if (account?.provider === "google" || account?.provider === "github") {
        if (token.email) {
          try {
            const dbUser = await firestoreDb.users.findByEmail(
              token.email as string
            );
            if (dbUser) {
              token.id = dbUser.id!;
              token.role = dbUser.role;
            }
          } catch (error) {
            // If Firebase fails, use fallback values
            console.error("Error fetching OAuth user from Firebase:", error);
            token.id = token.id || token.email;
            token.role = token.role || "user";
          }
        }
      }

      return token;
    },

    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      if (session.user) {
        (session.user as any).id = token.id || session.user.email;
        (session.user as any).role = token.role || "user";
      }
      return session;
    },

    async redirect({
      url,
      baseUrl,
    }: {
      url: string;
      baseUrl: string;
    }): Promise<string> {
      if (url === baseUrl || url === "/") {
        return `${baseUrl}/`;
      }
      return url;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
