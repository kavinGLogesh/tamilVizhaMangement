const CreditEntry = require('../models/CreditEntry');

exports.getCredits = async (req, res) => {
  try {
    const entries = await CreditEntry.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ entries });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.addCredit = async (req, res) => {
  try {
    const { name, address, cashAmount, goldCarats, goldGrams, silverGrams, note, date, functionType } = req.body;
    const entry = await CreditEntry.create({
      userId: req.user.id, functionType: functionType || req.user.functionType,
      name, address, cashAmount: cashAmount || 0, goldCarats: goldCarats || 0,
      goldGrams: goldGrams || 0, silverGrams: silverGrams || 0, note, date
    });
    res.status(201).json({ entry });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateCredit = async (req, res) => {
  try {
    const entry = await CreditEntry.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, req.body, { new: true }
    );
    if (!entry) return res.status(404).json({ message: 'Not found' });
    res.json({ entry });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteCredit = async (req, res) => {
  try {
    await CreditEntry.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
