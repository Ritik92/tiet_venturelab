// auth.config.ts
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Input validation
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        if (!credentials.email.includes('@')) {
          throw new Error("Invalid email format");
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            }
          });

          // User existence check
          if (!user) {
            throw new Error("No user found with this email");
          }

          if (!user.emailVerified) {
            throw new Error("Please verify your email before signing in");
          }
          
          const isValid = await compare(credentials.password, user.password);
          
          if (!isValid) {
            throw new Error("Invalid password");
          }
          

          return {
            id: user.id,
            email: user.email,
            name: user.name
          };

        } catch (error) {
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.error(`Database error: ${error.code}`, error.message);
            throw new Error("Database error occurred");
          }

          if (error instanceof Error) {
            throw error;
          }

          console.error("Unexpected error during authentication:", error);
          throw new Error("An unexpected error occurred");
        } finally {
          // Clean up Prisma connection
          await prisma.$disconnect();
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    error: "/auth/error", // Add an error page
  },
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          token.id = user.id;
          token.email = user.email;
          token.name = user.name;
        }
        return token;
      } catch (error) {
        console.error("JWT callback error:", error);
        throw error;
      }
    },
    async session({ session, token }) {
      try {
        if (token) {
          session.user = {
            //@ts-ignore
            id: token.id as string,
            email: token.email as string,
            name: token.name as string
          };
        }
        return session;
      } catch (error) {
        console.error("Session callback error:", error);
        throw error;
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
};
