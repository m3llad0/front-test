import { NextRequest, NextResponse } from 'next/server';
import { auth, setUserClaims } from '@service/firebaseAdmin'; // Ensure these are correctly imported from firebaseAdmin

export async function POST(req: NextRequest) {
  try {
    // Extract email, password, and userType from the request body
    const { email, password, userType } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Create the user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
    });

    // If userType is provided, set custom claims for the user
    if (userType) {
      await setUserClaims(userRecord.uid, userType);
    }

    // Return a success response with the UID of the created user
    return NextResponse.json({ message: `User created successfully`, uid: userRecord.uid }, { status: 201 });
  } catch (error) {
    console.error('Error creating Firebase user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}