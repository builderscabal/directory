import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { newPassword, userId } = await request.json();

    try {
        const user = await clerkClient.users.getUser(userId);

        if (!user) return null

        await clerkClient.users.updateUser(userId, {
            password: newPassword
        });

        return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
    } catch (error) {
        console.error('Error changing password:', error);
        return NextResponse.json({ error: 'Failed to change password', details: error }, { status: 500 });
    }
};