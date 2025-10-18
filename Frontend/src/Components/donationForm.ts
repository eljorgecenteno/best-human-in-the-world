import { useState } from 'react';
import { api } from '../api';

export default function DonationForm() {
  const [name, setName] = useState('');
  const [amountEUR, setAmountEUR] = useState(''); // escrito por usuario
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading'); setErrorMsg('');

    const amount = Math.round(Number(amountEUR) * 100);
    if (!name || !amount || isNaN(amount) || amount <= 0) {
      setStatus('error'); setErrorMsg('Nombre e importe válido (>0) son obligatorios');
      return;
    }

    try {
      await api.donateMock({ name, amount, message });
      setStatus('ok'); setName(''); setAmountEUR(''); setMessage('');
    } catch {
      setStatus('error'); setErrorMsg('No se pudo crear la donación');
    }
  }

  return (
    <form onSubmit={submit} style={{ display:'grid', gap:8, maxWidth:520 }}>
      <label>Nombre
        <input value={name} onChange={e => setName(e.target.value)} required />
      </label>
      <label>Importe (€)
        <input type="number" min="0" step="0.01"
               value={amountEUR} onChange={e => setAmountEUR(e.target.value)} required />
      </label>
      <label>Mensaje (opcional)
        <textarea value={message} onChange={e => setMessage(e.target.value)} maxLength={280} />
      </label>
      <button type="submit" disabled={status==='loading'}>
        {status==='loading' ? 'Enviando…' : 'Donar (mock)'}
      </button>
      {status==='ok' && <div style={{ color:'green' }}>✅ Donación enviada. ¡Gracias!</div>}
      {status==='error' && <div style={{ color:'crimson' }}>❌ {errorMsg}</div>}
    </form>
  );
}
