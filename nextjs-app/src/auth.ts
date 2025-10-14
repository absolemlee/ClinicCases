import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          // Find user by username
          const user = await prisma.user.findUnique({
            where: {
              username: credentials.username as string,
            },
          });

          if (!user) {
            return null;
          }

          // Check if user is active
          if (user.status !== "active") {
            return null;
          }

          // Verify password
          // Note: In the legacy system, passwords might not be hashed
          // For now, we'll do a direct comparison, but in production
          // you should migrate to hashed passwords
          const isPasswordValid = 
            credentials.password === user.password || // Direct comparison (legacy)
            await bcrypt.compare(credentials.password as string, user.password); // Hashed comparison

          if (!isPasswordValid) {
            return null;
          }

          // Return user object (will be stored in JWT)
          return {
            id: user.id.toString(),
            name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username,
            email: user.email || undefined,
            username: user.username,
            group: user.grp || undefined,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
        token.group = (user as any).group;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).username = token.username;
        (session.user as any).group = token.group;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
});
