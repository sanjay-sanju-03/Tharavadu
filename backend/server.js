const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'tharavad-super-secret-key-2024';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tharavad';

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── MongoDB Connection ───────────────────────────────────────────────────────
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// ─── Schemas & Models ─────────────────────────────────────────────────────────

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true }
}, { timestamps: true });

const memberSchema = new mongoose.Schema({
  memberId: { type: String, required: true, unique: true, trim: true, uppercase: true },
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  joinYear: { type: Number, required: true }
}, { timestamps: true });

const paymentSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  year: { type: Number, required: true },
  amount: { type: Number, default: 1000 },
  status: { type: String, enum: ['done', 'not done'], default: 'not done' }
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);
const Member = mongoose.model('Member', memberSchema);
const Payment = mongoose.model('Payment', paymentSchema);

// ─── Auth Middleware ──────────────────────────────────────────────────────────
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"
  if (!token) return res.status(401).json({ message: 'Access denied. No token.' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

// Helper: transform Mongoose doc to plain object with `id` field
const toJSON = (doc) => {
  const obj = doc.toObject ? doc.toObject() : doc;
  obj.id = obj._id.toString();
  return obj;
};

// ─── SEED (Dev only) ──────────────────────────────────────────────────────────
app.post('/api/seed', async (req, res) => {
  try {
    // Clear existing
    await Admin.deleteMany({});
    await Payment.deleteMany({});
    await Member.deleteMany({});

    // Create admin
    const hashedPw = await bcrypt.hash('admin123', 10);
    await Admin.create({ username: 'admin', password: hashedPw });

    // Create members
    const membersData = [
      { memberId: 'T001', name: 'Ravi Kumar', phone: '9876543210', email: 'ravi@example.com', joinYear: 2020 },
      { memberId: 'T002', name: 'Suma Reddy', phone: '9765432109', email: 'suma@example.com', joinYear: 2021 },
      { memberId: 'T003', name: 'Arun Menon', phone: '8765432109', email: 'arun@example.com', joinYear: 2020 },
      { memberId: 'T004', name: 'Divya Sharma', phone: '8654321098', email: 'divya@example.com', joinYear: 2022 },
      { memberId: 'T005', name: 'Nitin Gupta', phone: '7654321098', email: 'nitin@example.com', joinYear: 2021 },
      { memberId: 'T006', name: 'Priya Nair', phone: '7543210987', email: 'priya@example.com', joinYear: 2023 },
    ];
    const members = await Member.insertMany(membersData);

    // Create payments  (status map per member index, per year)
    const paymentsData = [
      // T001
      { member: members[0]._id, year: 2023, amount: 1000, status: 'done' },
      { member: members[0]._id, year: 2024, amount: 1000, status: 'done' },
      // T002
      { member: members[1]._id, year: 2023, amount: 1000, status: 'not done' },
      { member: members[1]._id, year: 2024, amount: 1000, status: 'not done' },
      // T003
      { member: members[2]._id, year: 2023, amount: 1000, status: 'done' },
      { member: members[2]._id, year: 2024, amount: 1000, status: 'done' },
      // T004
      { member: members[3]._id, year: 2023, amount: 1000, status: 'done' },
      { member: members[3]._id, year: 2024, amount: 1000, status: 'done' },
      // T005
      { member: members[4]._id, year: 2023, amount: 1000, status: 'not done' },
      { member: members[4]._id, year: 2024, amount: 1000, status: 'done' },
      // T006
      { member: members[5]._id, year: 2023, amount: 1000, status: 'done' },
      { member: members[5]._id, year: 2024, amount: 1000, status: 'not done' },
    ];
    await Payment.insertMany(paymentsData);

    res.json({ message: '✅ Database seeded successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Seed failed: ' + err.message });
  }
});

// ─── AUTH ─────────────────────────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: 'Username and password required' });

  try {
    const admin = await Admin.findOne({ username });
    if (!admin)
      return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      admin: { id: admin._id, username: admin.username }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
app.get('/api/dashboard', authenticate, async (req, res) => {
  try {
    const totalMembers = await Member.countDocuments();
    const totalPaymentsDone = await Payment.countDocuments({ status: 'done' });
    const totalPaymentsPending = await Payment.countDocuments({ status: 'not done' });

    const collectedResult = await Payment.aggregate([
      { $match: { status: 'done' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalCollected = collectedResult[0]?.total || 0;

    const payments2023 = await Payment.find({ year: 2023 }).populate('member', 'memberId name');
    const payments2024 = await Payment.find({ year: 2024 }).populate('member', 'memberId name');

    const formatPayments = (payments) => payments.map(p => ({
      id: p._id,
      memberId: p.member?.memberId || '—',
      memberName: p.member?.name || '—',
      year: p.year,
      amount: p.amount,
      status: p.status
    }));

    res.json({
      totalMembers,
      totalPaymentsDone,
      totalPaymentsPending,
      totalCollected,
      paymentsByYear: {
        2023: formatPayments(payments2023),
        2024: formatPayments(payments2024)
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// ─── MEMBERS ──────────────────────────────────────────────────────────────────
app.get('/api/members', authenticate, async (req, res) => {
  try {
    const { search = '', year = '' } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { memberId: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (year) filter.joinYear = parseInt(year);

    const members = await Member.find(filter).sort({ memberId: 1 });

    // Attach payments for each member
    const enriched = await Promise.all(members.map(async (m) => {
      const payments = await Payment.find({ member: m._id });
      return {
        id: m._id,
        memberId: m.memberId,
        name: m.name,
        phone: m.phone,
        email: m.email,
        joinYear: m.joinYear,
        payments: payments.map(p => ({
          id: p._id,
          year: p.year,
          amount: p.amount,
          status: p.status
        }))
      };
    }));

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

app.get('/api/members/:id', authenticate, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });

    const payments = await Payment.find({ member: member._id });
    res.json({
      id: member._id,
      memberId: member.memberId,
      name: member.name,
      phone: member.phone,
      email: member.email,
      joinYear: member.joinYear,
      payments: payments.map(p => ({
        id: p._id, year: p.year, amount: p.amount, status: p.status
      }))
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

app.post('/api/members', authenticate, async (req, res) => {
  const { memberId, name, phone, email, joinYear } = req.body;
  if (!memberId || !name || !phone || !email || !joinYear)
    return res.status(400).json({ message: 'All fields are required' });

  try {
    const exists = await Member.findOne({ memberId: memberId.toUpperCase() });
    if (exists) return res.status(400).json({ message: 'Member ID already exists' });

    const member = await Member.create({ memberId, name, phone, email, joinYear: parseInt(joinYear) });

    // Auto-create payment records for 2023, 2024, 2025
    await Payment.insertMany([
      { member: member._id, year: 2023, amount: 1000, status: 'not done' },
      { member: member._id, year: 2024, amount: 1000, status: 'not done' },
      { member: member._id, year: 2025, amount: 1000, status: 'not done' },
    ]);

    res.status(201).json({ message: 'Member added successfully', member: { id: member._id, ...member.toObject() } });
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

app.put('/api/members/:id', authenticate, async (req, res) => {
  try {
    const { name, phone, email, joinYear } = req.body;
    const update = {};
    if (name) update.name = name;
    if (phone) update.phone = phone;
    if (email) update.email = email;
    if (joinYear) update.joinYear = parseInt(joinYear);

    const member = await Member.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!member) return res.status(404).json({ message: 'Member not found' });

    res.json({ message: 'Member updated successfully', member: { id: member._id, ...member.toObject() } });
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

app.delete('/api/members/:id', authenticate, async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });

    await Payment.deleteMany({ member: req.params.id });
    res.json({ message: 'Member and associated payments deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// ─── PAYMENTS ─────────────────────────────────────────────────────────────────
app.get('/api/payments', authenticate, async (req, res) => {
  try {
    const { year, status, search } = req.query;
    const filter = {};
    if (year) filter.year = parseInt(year);
    if (status) filter.status = status;

    let payments = await Payment.find(filter).populate('member', 'memberId name');

    if (search) {
      payments = payments.filter(p =>
        p.member?.name.toLowerCase().includes(search.toLowerCase()) ||
        p.member?.memberId.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json(payments.map(p => ({
      id: p._id,
      memberId: p.member?.memberId || '—',
      memberName: p.member?.name || '—',
      year: p.year,
      amount: p.amount,
      status: p.status
    })));
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

app.put('/api/payments/:id', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['done', 'not done'].includes(status))
      return res.status(400).json({ message: 'Invalid status' });

    const payment = await Payment.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    res.json({ message: 'Payment updated', payment: { id: payment._id, ...payment.toObject() } });
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// ─── CLEAR (Dev) ──────────────────────────────────────────────────────────────
app.post('/api/clear', async (req, res) => {
  try {
    await Payment.deleteMany({});
    await Member.deleteMany({});
    res.json({ message: '✅ All members and payments cleared!' });
  } catch (err) {
    res.status(500).json({ message: 'Clear failed: ' + err.message });
  }
});

// ─── HEALTH ───────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'running',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅ Tharavad Backend running on http://localhost:${PORT}`);
  console.log(`📝 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🌱 Seed DB: POST http://localhost:${PORT}/api/seed\n`);
});
