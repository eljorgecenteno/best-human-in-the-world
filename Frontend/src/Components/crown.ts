import { useEffect, useState } from 'react';
import { api } from '../api';
import type { Crown } from '../types';
import { formatCentsEUR } from '../utils/money';

export default function CrownCard() {
  const [crown, setCrown] = useState<Crown | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  async function load() {
    try {
      setLoading(true); setErr('');
      const { crown } = await api.crown();
      setCrown(crown);
    } catch {
      setErr('No se pudo cargar la corona');
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  if (loading) return <div>👑 Cargando corona…</div>;
  if (err) return <div>❌ {err}</div>;
  if (!crown) return <div>👑 Aún no hay coronado. ¡Sé el primero!</div>;

  return (
    <div style={{ border:'1px solid #ddd', borderRadius:12, padding:16 }}>
      <h2 style={{ marginTop:0 }}>Coronado actual 👑</h2>
      <p><strong>{crown.name}</strong> con {formatCentsEUR(crown.amount)}</p>
      {crown.message && <p style={{ opacity:0.85 }}>"{crown.message}"</p>}
      <button onClick={load} style={{ marginTop:12 }}>Actualizar</button>
    </div>
  );
}
