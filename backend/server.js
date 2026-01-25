const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory database (replace with real DB later)
const admins = [
  { id: 1, username: 'admin', password: '$2a$10$YIXHk7hN5x5Y0z7j6Z3Z6uZ6Z3Z6Z3Z6Z3Z6Z3Z6Z3Z6Z3Z6Z3Z6' } // password: admin123
];

const members = [
  { id: 1, memberId: 'T001', name: 'Ravi Kumar', phone: '9876543210', email: 'ravi@example.com', joinYear: 2020 },
  { id: 2, memberId: 'T002', name: 'Suma Reddy', phone: '9765432109', email: 'suma@example.com', joinYear: 2021 },
  { id: 3, memberId: 'T003', name: 'Arun Menon', phone: '8765432109', email: 'arun@example.com', joinYear: 2020 },
  { id: 4, memberId: 'T004', name: 'Divya Sharma', phone: '8654321098', email: 'divya@example.com', joinYear: 2022 },
  { id: 5, memberId: 'T005', name: 'Nitin Gupta', phone: '7654321098', email: 'nitin@example.com', joinYear: 2021 },
  { id: 6, memberId: 'T006', name: 'Priya Nair', phone: '7543210987', email: 'priya@example.com', joinYear: 2023 }
];

const payments = [
  { id: 1, memberId: 1, year: 2023, amount: 1000, status: 'done' },
  { id: 2, memberId: 1, year: 2024, amount: 1000, status: 'done' },
  { id: 3, memberId: 2, year: 2023, amount: 1000, status: 'not done' },
  { id: 4, memberId: 2, year: 2024, amount: 1000, status: 'not done' },
  { id: 5, memberId: 3, year: 2023, amount: 1000, status: 'done' },
  { id: 6, memberId: 3, year: 2024, amount: 1000, status: 'done' },
  { id: 7, memberId: 4, year: 2023, amount: 1000, status: 'done' },
  { id: 8, memberId: 4, year: 2024, amount: 1000, status: 'done' },
  { id: 9, memberId: 5, year: 2023, amount: 1000, status: 'not done' },
  { id: 10, memberId: 5, year: 2024, amount: 1000, status: 'done' },
  { id: 11, memberId: 6, year: 2023, amount: 1000, status: 'done' },
  { id: 12, memberId: 6, year: 2024, amount: 1000, status: 'not done' }
];

// Routes

// Admin Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }
  
  const admin = admins.find(a => a.username === username);
  
  if (!admin) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // For demo purposes, simple password check
  if (password === 'admin123') {
    return res.status(200).json({ 
      message: 'Login successful',
      token: 'demo-token-' + Date.now(),
      admin: { id: admin.id, username: admin.username }
    });
  }
  
  return res.status(401).json({ message: 'Invalid credentials' });
});

// Get Dashboard Data
app.get('/api/dashboard', (req, res) => {
  const totalMembers = members.length;
  const totalPaymentsDone = payments.filter(p => p.status === 'done').length;
  const totalPaymentsPending = payments.filter(p => p.status === 'not done').length;
  const totalCollected = payments.filter(p => p.status === 'done').reduce((sum, p) => sum + p.amount, 0);
  
  res.json({
    totalMembers,
    totalPaymentsDone,
    totalPaymentsPending,
    totalCollected,
    paymentsByYear: {
      2023: payments.filter(p => p.year === 2023),
      2024: payments.filter(p => p.year === 2024)
    }
  });
});

// Get All Members
app.get('/api/members', (req, res) => {
  const searchQuery = req.query.search || '';
  const yearFilter = req.query.year || '';
  let filtered = [...members];

  if (searchQuery) {
    filtered = filtered.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.memberId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phone.includes(searchQuery) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (yearFilter) {
    filtered = filtered.filter(m => m.joinYear === parseInt(yearFilter));
  }

  // Add payment status from payments array
  const enrichedMembers = filtered.map(member => {
    const memberPayments = payments.filter(p => p.memberId === member.id);
    return { ...member, payments: memberPayments };
  });

  res.json(enrichedMembers);
});

// Get Member Details with Payments
app.get('/api/members/:id', (req, res) => {
  const member = members.find(m => m.id === parseInt(req.params.id));
  if (!member) return res.status(404).json({ message: 'Member not found' });
  
  const memberPayments = payments.filter(p => p.memberId === member.id);
  res.json({ ...member, payments: memberPayments });
});

// Add New Member
app.post('/api/members', (req, res) => {
  const { memberId, name, phone, email, joinYear } = req.body;
  
  if (!memberId || !name || !phone || !email || !joinYear) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  // Check if member ID already exists
  if (members.find(m => m.memberId === memberId)) {
    return res.status(400).json({ message: 'Member ID already exists' });
  }
  
  const newMember = {
    id: Math.max(...members.map(m => m.id), 0) + 1,
    memberId,
    name,
    phone,
    email,
    joinYear: parseInt(joinYear)
  };
  
  members.push(newMember);
  
  res.status(201).json({ 
    message: 'Member added successfully',
    member: newMember 
  });
});

// Update Member
app.put('/api/members/:id', (req, res) => {
  const member = members.find(m => m.id === parseInt(req.params.id));
  if (!member) return res.status(404).json({ message: 'Member not found' });
  
  const { name, phone, email, joinYear } = req.body;
  
  if (name) member.name = name;
  if (phone) member.phone = phone;
  if (email) member.email = email;
  if (joinYear) member.joinYear = parseInt(joinYear);
  
  res.json({ message: 'Member updated successfully', member });
});

// Get Payments with Search
app.get('/api/payments', (req, res) => {
  const { year, status, search } = req.query;
  let filtered = [...payments];
  
  if (year) filtered = filtered.filter(p => p.year === parseInt(year));
  if (status) filtered = filtered.filter(p => p.status === status);
  
  if (search) {
    const memberNames = members.map(m => ({ id: m.id, name: m.name }));
    filtered = filtered.filter(p => {
      const member = memberNames.find(m => m.id === p.memberId);
      return member && member.name.toLowerCase().includes(search.toLowerCase());
    });
  }
  
  res.json(filtered);
});

// Update Payment Status
app.put('/api/payments/:id', (req, res) => {
  const { status } = req.body;
  const payment = payments.find(p => p.id === parseInt(req.params.id));
  
  if (!payment) return res.status(404).json({ message: 'Payment not found' });
  
  if (['done', 'not done'].includes(status)) {
    payment.status = status;
    return res.json({ message: 'Payment updated', payment });
  }
  
  res.status(400).json({ message: 'Invalid status' });
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`\n✅ Tharavad Backend running on http://localhost:${PORT}`);
  console.log(`📝 API Base URL: http://localhost:${PORT}/api`);
});
