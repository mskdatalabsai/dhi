// types/next-auth.d.ts (create this file in your project root)

import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: string;
      hasPaid?: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    role: string;
    hasPaid?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    hasPaid?: boolean;
  }
}
declare module "next-auth/providers/credentials" {
  interface Credentials {
    email: string;
    password: string;
  }
}
declare module "next-auth/providers/google" {
  interface GoogleProfile {
    id: string;
    email: string;
    name?: string | null;
    picture?: string | null;
  }
}
declare module "next-auth/providers/github" {
  interface GitHubProfile {
    id: string;
    email: string;
    name?: string | null;
    avatar_url?: string | null;
  }
}
