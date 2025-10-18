import Crown from './components/Crown';
import LatestDonations from './components/LatestDonations';
import DonationForm from './components/DonationForm';

export default function App() {
  return (
    <div style={{ maxWidth:720, margin:'0 auto', padding:16, fontFamily:'system-ui, sans-serif' }}>
      <header style={{ marginBottom:24 }}>
        <h1 style={{ margin:0 }}>bestHuman 👑</h1>
        <p style={{ margin:'8px 0 0' }}>Donaciones, coronación automática y últimas 5 con mensaje.</p>
      </header>

      <section style={{ marginBottom:24 }}>
        <Crown />
      </section>

      <section style={{ marginBottom:24 }}>
        <h2>Haz tu donación (mock)</h2>
        <DonationForm />
      </section>

      <section style={{ marginBottom:24 }}>
        <LatestDonations />
      </section>
    </div>
  );
}
