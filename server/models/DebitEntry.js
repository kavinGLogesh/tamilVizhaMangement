const mongoose = require('mongoose');

const debitEntrySchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  functionType: { type: String, required: true },
  purpose:      { type: String, required: true },
  amount:       { type: Number, required: true },
  date:         { type: Date, default: Date.now },
  note:         { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('DebitEntry', debitEntrySchema);
