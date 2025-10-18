import type {
  CrownResponse, LatestDonationsResponse,
  MockDonationRequest, MockDonationResponse
} from './types';

const API = import.meta.env.VITE_API_URL;

async function getJSON<T>(url: string): Promise<T> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json() as Promise<T>;
}
async function postJSON<TBody extends object, TResp>(url: string, body: TBody): Promise<TResp> {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json() as Promise<TResp>;
}

export const api = {
  crown: () => getJSON<CrownResponse>(`${API}/api/crown`),
  latest: () => getJSON<LatestDonationsResponse>(`${API}/api/donations/latest`),
  donateMock: (payload: MockDonationRequest) =>
    postJSON<MockDonationRequest, MockDonationResponse>(`${API}/api/donations/mock`, payload),
};
