import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carga el .env que está en Backend/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente 🚀');
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Servidor en puerto ${process.env.PORT || 8080}`);
});

import { Donation, Crown } from './models.js';

// --- Rutas básicas ---
app.get('/api/health', (req, res) => {
  res.json({ ok: true, now: new Date().toISOString() });
});

// Crear donación “mock” (sin Stripe, para probar)
app.post('/api/donations/mock', async (req, res) => {
  try {
    const { name, amount, message } = req.body;
    if (!name || !amount) return res.status(400).json({ error: 'Faltan campos obligatorios' });

    const donation = await Donation.create({ name, amount, message, status: 'succeeded' });
    await updateCrownIfNeeded(donation);

    res.json({ ok: true, donation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudo crear donación mock' });
  }
});

// Obtener las últimas 5 donaciones
app.get('/api/donations/latest', async (_req, res) => {
  const donations = await Donation.find({ status: 'succeeded' })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();
  res.json({ donations });
});

// Obtener la corona actual
app.get('/api/crown', async (_req, res) => {
  const crown = await Crown.findOne().sort({ createdAt: -1 }).lean();
  res.json({ crown });
});

// Función auxiliar: coronación automática
async function updateCrownIfNeeded(donationDoc) {
  const current = await Crown.findOne().sort({ createdAt: -1 });
  if (!current || donationDoc.amount >= current.amount) {
    await Crown.create({
      donationId: donationDoc._id,
      name: donationDoc.name,
      amount: donationDoc.amount,
      message: donationDoc.message,
      since: new Date()
    });
  }
}


