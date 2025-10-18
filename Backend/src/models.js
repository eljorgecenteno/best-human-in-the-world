import mongoose from 'mongoose';

const DonationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 60 },
  amount: { type: Number, required: true, min: 1 }, // céntimos
  message: { type: String, trim: true, maxlength: 280 },
  status: { type: String, enum: ['pending', 'succeeded', 'failed'], default: 'succeeded' }, // mock => succeeded
}, { timestamps: true });

DonationSchema.index({ createdAt: -1 });
DonationSchema.index({ amount: -1 });

const CrownSchema = new mongoose.Schema({
  donationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true }, // céntimos
  message: { type: String, maxlength: 280 },
  since: { type: Date, default: Date.now },
}, { timestamps: true });

export const Donation = mongoose.model('Donation', DonationSchema);
export const Crown = mongoose.model('Crown', CrownSchema);
