import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Account } from '@/types/account';

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'accounts'), (snap) => {
      const list = snap.docs.map((d) => d.data() as Account);
      setAccounts(list);
      setLoading(false);
    });
    return unsub;
  }, []);

  const approveAccount = async (uid: string, adminUid: string) => {
    await updateDoc(doc(db, 'accounts', uid), {
      status: 'active',
      approvedAt: serverTimestamp(),
      approvedBy: adminUid,
    });
  };

  const suspendAccount = async (uid: string) => {
    await updateDoc(doc(db, 'accounts', uid), { status: 'suspended' });
  };

  const reactivateAccount = async (uid: string) => {
    await updateDoc(doc(db, 'accounts', uid), { status: 'active' });
  };

  const updateRenewalDate = async (uid: string, date: Date) => {
    await updateDoc(doc(db, 'accounts', uid), {
      renewalDate: Timestamp.fromDate(date),
    });
  };

  return { accounts, loading, approveAccount, suspendAccount, reactivateAccount, updateRenewalDate };
}
