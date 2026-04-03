
const Record = require('../models/Record');

exports.getRecords = async (req, res) => {
  try {
    const records = await Record.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ records });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.searchRecords = async (req, res) => {
  try {
    const q = req.query.q || '';
    const records = await Record.find({ userId: req.user.id, $or: [{ name: { $regex: q, $options: 'i' } }, { address: { $regex: q, $options: 'i' } }] }).limit(10).sort({ createdAt: -1 });
    res.json({ records });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getAllRecords = async (req, res) => {
  try {
    const records = await Record.find().populate('userId', 'username').sort({ createdAt: -1 });
    res.json({ records });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.addRecord = async (req, res) => {
  try {
    const { name, address, amount, functionType, date } = req.body;
    const record = await Record.create({ userId: req.user.id, name, address, amount, functionType, date });
    res.status(201).json({ record });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateRecord = async (req, res) => {
  try {
    const record = await Record.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true });
    if (!record) return res.status(404).json({ message: 'Not found' });
    res.json({ record });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteRecord = async (req, res) => {
  try {
    await Record.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
