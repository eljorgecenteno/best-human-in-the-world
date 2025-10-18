import { useEffect, useState } from 'react';

type Donation = {
  _id: string; name: string; amount: number; message?: string; status: string; createdAt: string;
};
type Crown = { _id: string; name: string; amount: number; message?: string; since: string };

const API = import.meta.env.VITE_API_URL;

function eur(cents: number) {
  return (cents / 100).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
}

export default function App() {
  const [crown, setCrown] = useState<Crown | null>(null);
  const [latest, setLatest] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const [name, setName] = useState('');
  const [amountEUR, setAmountEUR] = useState('');
  const [message, setMessage] = useState('');
  const [posting, setPosting] = useState(false);
  const [okMsg, setOkMsg] = useState('');

  async function loadAll() {
    try {
      setLoading(true); setErr('');
      const [crownRes, latestRes] = await Promise.all([
        fetch(`${API}/api/crown`).then(r => r.json()),
        fetch(`${API}/api/donations/latest`).then(r => r.json()),
      ]);
      setCrown(crownRes.crown ?? null);
      setLatest(latestRes.donations ?? []);
    } catch {
      setErr('No se pudo cargar la información');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAll(); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPosting(true); setOkMsg(''); setErr('');
    const amount = Math.round(Number(amountEUR) * 100);
    if (!name || !amount || isNaN(amount) || amount <= 0) {
      setErr('Nombre e importe válido (>0) son obligatorios');
      setPosting(false);
      return;
    }
    try {
      const res = await fetch(`${API}/api/donations/mock`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ name, amount, message }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setOkMsg('✅ Donación enviada');
      setName(''); setAmountEUR(''); setMessage('');
      await loadAll();
    } catch {
      setErr('No se pudo crear la donación');
    } finally {
      setPosting(false);
    }
  }

  return (
    <div id="main-box">
      <h1 id="main-title">Best human in the world 👑</h1>

      {loading ? (
        <p>Cargando…</p>
      ) : err ? (
        <p className="error">{err}</p>
      ) : (
        <>
          <section className="section card">
            <h2>And the best human in the world is: </h2>
            {crown ? (
              <>
                <p id="crown-name"><strong>{crown.name}</strong> <br>
                       </br> Donated {eur(crown.amount)}</p>
                {crown.message && <p  className="quote">their message to the world is: <br></br><p id="crown-message">"{crown.message}"</p></p>}
              </>
            ) : (
              <p >Sin corona todavía. ¡Sé el primero!</p>
            )}
          </section>

          <section className="section">
            <h2>Haz tu donación (mock)</h2>
            <form className="form" onSubmit={submit}>
              <label>
                Nombre
                <input className="input" value={name} onChange={e => setName(e.target.value)} required />
              </label>

              <label>
                Importe (€)
                <input
                  className="input"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amountEUR}
                  onChange={e => setAmountEUR(e.target.value)}
                  required
                />
              </label>

              <label>
                Mensaje (opcional)
                <textarea
                  className="textarea"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  maxLength={280}
                />
              </label>

              <button className="button" type="submit" disabled={posting}>
                {posting ? 'Enviando…' : 'Donar (mock)'}
              </button>

              {okMsg && <div className="ok">{okMsg}</div>}
            </form>
          </section>

          <section className="section">
            <h2>Últimas donaciones</h2>
            {!latest.length ? (
              <p>Sin donaciones aún.</p>
            ) : (
              <ul className="list">
                {latest.map(d => (
                  <li key={d._id} className="list-item">
                    <div><strong>{d.name}</strong> — {eur(d.amount)}</div>
                    {d.message && <div className="quote">"{d.message}"</div>}
                    <div className="item-meta">{new Date(d.createdAt).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
