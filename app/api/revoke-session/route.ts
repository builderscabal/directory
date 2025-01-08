import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

async function revokeSessionWithRetry(sessionId: string, retries = 3): Promise<void> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      await clerkClient.sessions.revokeSession(sessionId);
      return;
    } catch (error) {
      if (attempt === retries - 1) {
        throw new Error(`Failed to revoke session after ${retries} attempts: ${error}`);
      }
      console.warn(`Attempt ${attempt + 1} failed: ${error}. Retrying...`);
    }
  }
};

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json();

    await revokeSessionWithRetry(sessionId);

    return NextResponse.json({ message: `Revoked session: ${sessionId}` });
  } catch (error) {
    console.error('Error revoking session:', error);
    return NextResponse.json({ error: 'Failed to revoke session', details: error }, { status: 500 });
  }
};