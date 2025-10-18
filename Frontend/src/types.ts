export interface Donation {
  _id: string;
  name: string;
  amount: number; // céntimos
  message?: string;
  status: 'pending' | 'succeeded' | 'failed';
  createdAt: string;
  updatedAt: string;
}
export interface Crown {
  _id: string;
  donationId: string;
  name: string;
  amount: number; // céntimos
  message?: string;
  since: string;
  createdAt: string;
  updatedAt: string;
}
export interface CrownResponse { crown: Crown | null }
export interface LatestDonationsResponse { donations: Donation[] }
export interface MockDonationRequest { name: string; amount: number; message?: string }
export interface MockDonationResponse { ok: boolean; donation: Donation }
