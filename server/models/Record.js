const mongoose = require('mongoose');

const FUNCTION_TYPES = [
  'kaathu_kuthu',
  'kalyanam',
  'veetu_punniyahavasanam',
  'valaikappu',
  'virundhu'
];

const recordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  amount: { type: Number, required: true },
  functionType: { type: String, enum: FUNCTION_TYPES, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Record', recordSchema);
