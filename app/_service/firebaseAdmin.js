import admin from 'firebase-admin';
// import serviceAccount from '../../firebase-service-account.json';

// Initialize Firebase Admin SDK if it hasn't been initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
      }
    ),
    databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`, // Optional
  });
}

export const auth = admin.auth();

// Set custom claims for a Firebase user
export async function setUserClaims(uid, userType) {
  try {
    await auth.setCustomUserClaims(uid, { userType });
    console.log(`Custom claim (userType: ${userType}) successfully set for user ${uid}`);
  } catch (error) {
    console.error('Error setting custom claims:', error);
    throw error;
  }
}

// Fetch Firebase user by UID
export async function getFirebaseUserByUid(uid) {
  try {
    const userRecord = await auth.getUser(uid);
    return userRecord;
  } catch (error) {
    console.error('Error fetching user by UID: ', error);
    throw error;
  }
}

// Delete Firebase user by UID
export async function deleteUserByUid(uid) {
  try {
    await auth.deleteUser(uid);
    console.log(`User with UID ${uid} deleted successfully`);
  } catch (error) {
    console.error(`Error deleting user with UID ${uid}: `, error);
    throw error;
  }
}