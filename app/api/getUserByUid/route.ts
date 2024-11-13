import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseUserByUid } from '@service/firebaseAdmin'; // Replace this with your actual service import

export async function POST(req: NextRequest) {
  try {
    const { uid } = await req.json(); // Parse JSON body from the request

    if (!uid) {
      return NextResponse.json({ error: 'UID is required' }, { status: 400 });
    }

    const user = await getFirebaseUserByUid(uid); // Fetch the Firebase user by UID

    return NextResponse.json({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      phoneNumber: user.phoneNumber,
    });
  } catch (error) {
    console.error('Error fetching user by UID:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}