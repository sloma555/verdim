import { Timestamp } from 'firebase/firestore';

export type AccountStatusType = "pending" | "active" | "suspended";

export interface Account {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  status: AccountStatusType;
  createdAt: Timestamp;
  approvedAt: Timestamp | null;
  approvedBy: string | null;
  renewalDate: Timestamp | null;
}
