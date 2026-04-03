const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const FUNCTION_TYPES = [
  'kaathu_kuthu',
  'kalyanam',
  'veetu_punniyahavasanam',
  'valaikappu',
  'virundhu'
];

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  registeredDate: { type: Date, default: Date.now },
  functionType: { type: String, enum: FUNCTION_TYPES, required: true }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
