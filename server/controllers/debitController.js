const DebitEntry = require('../models/DebitEntry');

exports.getDebits = async (req, res) => {
  try {
    const entries = await DebitEntry.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ entries });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.addDebit = async (req, res) => {
  try {
    const { purpose, amount, date, note, functionType } = req.body;
    const entry = await DebitEntry.create({
      userId: req.user.id, functionType: functionType || req.user.functionType,
      purpose, amount, date, note
    });
    res.status(201).json({ entry });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateDebit = async (req, res) => {
  try {
    const entry = await DebitEntry.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, req.body, { new: true }
    );
    if (!entry) return res.status(404).json({ message: 'Not found' });
    res.json({ entry });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteDebit = async (req, res) => {
  try {
    await DebitEntry.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
