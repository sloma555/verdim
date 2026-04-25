import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { isSuperAdmin } from '@/lib/constants';
import { AccountStatusType } from '@/types/account';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  accountStatus: AccountStatusType | null;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accountStatus, setAccountStatus] = useState<AccountStatusType | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        setAccountStatus(null);
        setLoading(false);
        return;
      }

      // Check/create account doc
      const accountRef = doc(db, 'accounts', u.uid);
      const accountSnap = await getDoc(accountRef);

      if (!accountSnap.exists()) {
        // First login — create account
        const status: AccountStatusType = isSuperAdmin(u.uid) ? 'active' : 'pending';
        await setDoc(accountRef, {
          uid: u.uid,
          email: u.email,
          displayName: u.displayName,
          photoURL: u.photoURL,
          status,
          createdAt: serverTimestamp(),
          approvedAt: null,
          approvedBy: null,
          renewalDate: null,
        });
      }

      // Real-time listener on account status
      const unsubAccount = onSnapshot(accountRef, (snap) => {
        if (snap.exists()) {
          setAccountStatus(snap.data().status as AccountStatusType);
        }
        setLoading(false);
      });

      return () => unsubAccount();
    });
    return unsub;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const isAdmin = !!user && isSuperAdmin(user.uid);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, accountStatus, isAdmin, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
