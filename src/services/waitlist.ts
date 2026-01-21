import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { getDb } from '../config/firebase';
import { getApiVersion } from '../config/featureFlags';
import { CHECK_WAITLIST_APPROVAL, JOIN_WAITLIST } from '../api';

export interface WaitlistCheckResult {
  isApproved: boolean;
}

export interface WaitlistJoinResult {
  message: string;
}

// Server implementation
const checkWaitlistApprovalServer = async (email: string): Promise<WaitlistCheckResult> => {
  const request = CHECK_WAITLIST_APPROVAL(email);
  const response = await fetch(request.url, request.options);

  if (!response.ok) {
    throw new Error('Failed to check approval status');
  }

  return response.json();
};

const joinWaitlistServer = async (
  name: string,
  email: string,
  buildDescription?: string
): Promise<WaitlistJoinResult> => {
  const request = JOIN_WAITLIST(name, email, buildDescription);
  const response = await fetch(request.url, request.options);

  if (!response.ok) {
    throw new Error('Failed to join waitlist');
  }

  return response.json();
};

// Firebase implementation
const checkWaitlistApprovalFirebase = async (email: string): Promise<WaitlistCheckResult> => {
  const db = getDb();
  const waitlistRef = collection(db, 'waitlist');
  const q = query(waitlistRef, where('email', '==', email.toLowerCase()));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return { isApproved: false };
  }

  const doc = querySnapshot.docs[0];
  const data = doc.data();
  return { isApproved: data.isApproved === true };
};

const joinWaitlistFirebase = async (
  name: string,
  email: string,
  buildDescription?: string
): Promise<WaitlistJoinResult> => {
  const db = getDb();
  const waitlistRef = collection(db, 'waitlist');
  const normalizedEmail = email.toLowerCase();

  // Check if email already exists
  const q = query(waitlistRef, where('email', '==', normalizedEmail));
  const querySnapshot = await getDocs(q);

  const now = Timestamp.now();

  if (!querySnapshot.empty) {
    // Update existing entry
    const docRef = querySnapshot.docs[0].ref;
    await updateDoc(docRef, {
      name,
      buildDescription: buildDescription || null,
      updatedAt: now,
    });
    return { message: "You're already on the waitlist! We've updated your information." };
  }

  // Create new entry
  await addDoc(waitlistRef, {
    email: normalizedEmail,
    name,
    buildDescription: buildDescription || null,
    isApproved: false,
    createdAt: now,
    updatedAt: now,
  });

  return { message: "You've been added to the waitlist!" };
};

// Public API
export const checkWaitlistApproval = async (email: string): Promise<WaitlistCheckResult> => {
  const apiVersion = getApiVersion();
  if (apiVersion === 'firebase') {
    return checkWaitlistApprovalFirebase(email);
  }
  return checkWaitlistApprovalServer(email);
};

export const joinWaitlist = async (
  name: string,
  email: string,
  buildDescription?: string
): Promise<WaitlistJoinResult> => {
  const apiVersion = getApiVersion();
  if (apiVersion === 'firebase') {
    return joinWaitlistFirebase(name, email, buildDescription);
  }
  return joinWaitlistServer(name, email, buildDescription);
};
