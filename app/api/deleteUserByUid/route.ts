import { NextRequest, NextResponse } from 'next/server';
import { deleteUserByUid } from '@service/firebaseAdmin'; // Ensure this import path is correct

export async function POST(req: NextRequest) {
  try {
    const { uid } = await req.json(); // Extract UID from request body

    if (!uid) {
      return NextResponse.json({ error: 'UID is required' }, { status: 400 });
    }

    // Delete the Firebase user by UID
    await deleteUserByUid(uid);

    return NextResponse.json({ message: `User with UID ${uid} deleted successfully` }, { status: 200 });
  } catch (error) {
    console.error('Error deleting Firebase user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}