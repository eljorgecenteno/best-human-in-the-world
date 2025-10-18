export function formatCentsEUR(cents) {
  const euros = (Number(cents || 0) / 100);
  return euros.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
}