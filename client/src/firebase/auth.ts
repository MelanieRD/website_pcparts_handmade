import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { User } from '../types/User';

const USERS_COLLECTION = 'users';

// Sign in with email and password
export const signInUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userData = await getUserData(userCredential.user.uid);
    return userData;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// Create new user account
export const createUser = async (
  email: string, 
  password: string, 
  name: string,
  role: 'admin' | 'user' = 'user'
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile
    await updateProfile(user, { displayName: name });
    
    // Create user document in Firestore
    const userData: User = {
      id: user.uid,
      name,
      email,
      role
    };
    
    await setDoc(doc(db, USERS_COLLECTION, user.uid), userData);
    
    return userData;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Sign out user
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Get user data from Firestore
export const getUserData = async (uid: string): Promise<User> => {
  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, uid));
    
    if (userDoc.exists()) {
      return userDoc.data() as User;
    } else {
      throw new Error('User data not found');
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

// Auth state listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      try {
        const userData = await getUserData(firebaseUser.uid);
        callback(userData);
      } catch (error) {
        console.error('Error getting user data on auth change:', error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

// Check if user is admin
export const isUserAdmin = async (uid: string): Promise<boolean> => {
  try {
    const userData = await getUserData(uid);
    return userData.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};
