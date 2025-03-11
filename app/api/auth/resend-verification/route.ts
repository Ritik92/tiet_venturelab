// app/api/auth/resend-verification/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { message: "Email is required" },
                { status: 400 }
            );
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        if (user.emailVerified) {
            return NextResponse.json(
                { message: "Email is already verified" },
                { status: 400 }
            );
        }

        // Generate new verification token
        const verificationToken = uuidv4();
        const tokenExpiry = new Date();
        tokenExpiry.setHours(tokenExpiry.getHours() + 24); // 24 hour expiry

        // Update user with new token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                verificationToken,
                verificationTokenExpiry: tokenExpiry,
            },
        });

        // Send verification email
        const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;
        await sendVerificationEmail(user.email, user.name, verificationUrl);

        return NextResponse.json(
            { message: "Verification email resent successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Resend verification error:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}