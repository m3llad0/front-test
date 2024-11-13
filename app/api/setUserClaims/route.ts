import { NextRequest, NextResponse } from 'next/server';
import { setUserClaims } from '@service/firebaseAdmin'; // Make sure the import path is correct

export async function POST(req: NextRequest) {
  try {
    // Parse the incoming request body
    const { uid, userType } = await req.json();

    // Validate that both uid and userType are provided
    if (!uid || !userType) {
      return NextResponse.json({ error: 'UID and userType are required' }, { status: 400 });
    }

    // Set custom user claims
    await setUserClaims(uid, userType);
    
    // Return success response
    return NextResponse.json({ message: 'Custom claims set successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error setting custom claims:', error);
    return NextResponse.json({ error: 'Failed to set custom claims' }, { status: 500 });
  }
}