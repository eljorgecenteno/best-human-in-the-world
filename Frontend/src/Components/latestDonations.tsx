import { useEffect, useState } from 'react';
import { api } from '../api';
import type { Donation } from '../types';
import { formatCentsEUR } from '../utils/money';

export default function LatestDonations() {
  const [items, setItems] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  async function load() {
    try {
      setLoading(true); setErr('');
      const { donations } = await api.latest();
      setItems(donations || []);
    } catch {
      setErr('No se pudo cargar el listado');
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  if (loading) return <div>📜 Cargando últimas donaciones…</div>;
  if (err) return <div>❌ {err}</div>;
  if (!items.length) return <div>📭 Aún no hay donaciones.</div>;

  return (
    <div>
      <h2>Últimas donaciones</h2>
      <ul style={{ listStyle:'none', padding:0, margin:0 }}>
        {items.map(d => (
          <li key={d._id} style={{ borderBottom:'1px solid #eee', padding:'12px 0' }}>
            <div><strong>{d.name}</strong> — {formatCentsEUR(d.amount)}</div>
            {d.message && <div style={{ opacity:0.85 }}>"{d.message}"</div>}
            <div style={{ fontSize:12, color:'#666' }}>{new Date(d.createdAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>
      <button onClick={load} style={{ marginTop:12 }}>Actualizar</button>
    </div>
  );
}
