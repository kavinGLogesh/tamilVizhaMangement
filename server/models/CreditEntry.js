const mongoose = require('mongoose');

const creditEntrySchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  functionType: { type: String, required: true },
  name:         { type: String, required: true },
  address:      { type: String, default: '' },
  cashAmount:   { type: Number, default: 0 },
  goldCarats:   { type: Number, default: 0 },
  goldGrams:    { type: Number, default: 0 },
  silverGrams:  { type: Number, default: 0 },
  note:         { type: String, default: '' },
  date:         { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('CreditEntry', creditEntrySchema);
