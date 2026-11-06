import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// In-Memory Database
const users = new Map();
const orders = new Map();
const verificationCodes = new Map();
const printJobs = [];
const travelRequests = [];

// Seed Default Accounts
users.set('8147228162', {
  phone: '8147228162',
  email: 'admin@omshivam.com',
  handle: '@om_shivam_admin',
  name: 'Store Manager',
  pin: '1234',
  role: 'shopkeeper',
  createdAt: new Date().toISOString()
});

users.set('918147228162', {
  phone: '918147228162',
  email: 'admin@omshivam.com',
  handle: '@om_shivam_admin',
  name: 'Store Manager',
  pin: '1234',
  role: 'shopkeeper',
  createdAt: new Date().toISOString()
});

users.set('9876543210', {
  phone: '9876543210',
  email: 'rahul@gmail.com',
  handle: '@rahul_01',
  name: 'Rahul Sharma',
  pin: '1234',
  role: 'customer',
  createdAt: new Date().toISOString()
});

// Seed Initial Sample Orders for live dashboard demo
const sampleOrder1 = {
  token: 'OSE-742',
  customerName: 'Rahul Sharma',
  customerPhone: '9876543210',
  customerHandle: '@rahul_01',
  pickupTime: 'Today within 30-45 minutes',
  extraNotes: 'Please pack 1 blue chart paper if available',
  items: [
    {
      product: {
        id: 'ose-01',
        name: 'Classmate Pulse 6-Subject Spiral Notebook (300 Pages)',
        brand: 'Classmate',
        price: 185
      },
      quantity: 2
    },
    {
      product: {
        id: 'ose-02',
        name: 'Parker Jotter Standard Ballpoint Pen (Blue Ink)',
        brand: 'Parker',
        price: 349
      },
      quantity: 1
    }
  ],
  total: 719,
  status: 'RECEIVED', // 'RECEIVED' | 'PACKING' | 'READY' | 'COLLECTED'
  createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
};
orders.set(sampleOrder1.token, sampleOrder1);

// Store Configuration
const STORE_DATA = {
  name: "OM SHIVAM ENTERPRISES",
  phone: "918147228162",
  mapsUrl: "https://maps.app.goo.gl/gBKD1gkP96SNW1VAA",
  address: "OM SHIVAM ENTERPRISES, Main Market, Stationery Dept.",
  hours: {
    weekdays: "Mon – Sat: 9:00 AM – 9:30 PM",
    sunday: "Sunday: 10:00 AM – 2:00 PM"
  },
  services: [
    "Stationery & Writing Instruments",
    "High-Speed Xerox & Color Printing",
    "Train, Flight & Bus Travel Tickets",
    "School, College & Office Supplies"
  ]
};

// -------------------------------------------------------------
// Authentication Endpoints
// -------------------------------------------------------------

// Check if Handle is Available (like Instagram)
app.get('/api/auth/check-handle/:handle', (req, res) => {
  const handle = req.params.handle.toLowerCase().startsWith('@')
    ? req.params.handle.toLowerCase()
    : `@${req.params.handle.toLowerCase()}`;

  for (const user of users.values()) {
    if (user.handle.toLowerCase() === handle) {
      return res.json({ available: false, message: `${handle} is already taken!` });
    }
  }

  return res.json({ available: true, message: `${handle} is available!` });
});

// Generate Free Verification Code (Reverse WhatsApp Handshake)
app.post('/api/auth/generate-verification-code', (req, res) => {
  const { phone, handle } = req.body;

  if (!phone || phone.length < 10) {
    return res.status(400).json({ error: 'Valid 10-digit phone number is required.' });
  }

  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  const code = Math.floor(1000 + Math.random() * 9000).toString(); // Unique 4-digit code

  verificationCodes.set(cleanPhone, {
    code,
    phone: cleanPhone,
    handle: handle || '@customer',
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
  });

  const whatsappMessage = encodeURIComponent(
    `Hi OM SHIVAM ENTERPRISES, my verification code is ${code} for my store ID ${handle || ''}.`
  );
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${STORE_DATA.phone}&text=${whatsappMessage}`;

  return res.json({
    success: true,
    code,
    phone: cleanPhone,
    whatsappUrl,
    message: `Generated verification code ${code} for phone ${cleanPhone}`
  });
});

// Register User (Direct, Instant, Professional)
app.post('/api/auth/register', (req, res) => {
  const { phone, email, handle, pin, name, password } = req.body;
  const userPin = pin || password;

  if (!phone || !userPin) {
    return res.status(400).json({ error: 'Valid 10-digit mobile number and PIN/password are required.' });
  }

  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  if (cleanPhone.length !== 10) {
    return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number.' });
  }

  // Generate clean handle if not provided
  let cleanHandle = handle ? (handle.startsWith('@') ? handle.toLowerCase() : `@${handle.toLowerCase()}`) : null;
  if (!cleanHandle) {
    if (name) {
      cleanHandle = `@${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    } else {
      cleanHandle = `@user_${cleanPhone.slice(-4)}`;
    }
  }

  // Check if phone already registered
  if (users.has(cleanPhone)) {
    return res.status(409).json({ error: 'An account with this mobile number already exists. Please sign in.' });
  }

  const newUser = {
    phone: cleanPhone,
    email: email || '',
    handle: cleanHandle,
    name: name?.trim() || cleanHandle.replace('@', ''),
    pin: userPin.toString(),
    role: (cleanPhone === '8147228162' || cleanPhone === '918147228162' || cleanHandle === '@om_shivam_admin') ? 'shopkeeper' : 'customer',
    createdAt: new Date().toISOString()
  };

  users.set(cleanPhone, newUser);

  return res.status(201).json({
    success: true,
    message: 'Account created successfully',
    user: {
      phone: newUser.phone,
      email: newUser.email,
      handle: newUser.handle,
      name: newUser.name,
      role: newUser.role
    }
  });
});

// Login User / Shopkeeper
app.post('/api/auth/login', (req, res) => {
  const { identifier, pin, password } = req.body; // identifier can be mobile, email, or @handle
  const userPin = pin || password;

  if (!identifier || !userPin) {
    return res.status(400).json({ error: 'Mobile number/email and PIN/password are required.' });
  }

  const cleanInput = identifier.trim().toLowerCase();
  const digitsOnly = cleanInput.replace(/\D/g, '').slice(-10);
  let foundUser = null;

  for (const user of users.values()) {
    if (
      (digitsOnly && user.phone === digitsOnly) ||
      (user.email && user.email.toLowerCase() === cleanInput) ||
      (user.handle && user.handle.toLowerCase() === cleanInput)
    ) {
      foundUser = user;
      break;
    }
  }

  if (!foundUser) {
    return res.status(404).json({ error: 'No account found with these credentials.' });
  }

  if (foundUser.pin !== userPin.toString()) {
    return res.status(401).json({ error: 'Invalid PIN or password. Please try again.' });
  }

  return res.json({
    success: true,
    message: `Welcome back, ${foundUser.name}!`,
    user: {
      phone: foundUser.phone,
      email: foundUser.email,
      handle: foundUser.handle,
      name: foundUser.name,
      role: foundUser.role
    }
  });
});

// Reset PIN
app.post('/api/auth/reset-pin', (req, res) => {
  const { phone, newPin, verificationCode } = req.body;
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);

  const stored = verificationCodes.get(cleanPhone);
  if (!stored || stored.code !== verificationCode.toString()) {
    return res.status(400).json({ error: 'Invalid or expired verification code.' });
  }

  const user = users.get(cleanPhone);
  if (!user) {
    return res.status(404).json({ error: 'No account found for this mobile number.' });
  }

  user.pin = newPin.toString();
  users.set(cleanPhone, user);
  verificationCodes.delete(cleanPhone);

  return res.json({ success: true, message: 'PIN updated successfully! You can now log in.' });
});

// -------------------------------------------------------------
// Orders Endpoints
// -------------------------------------------------------------

// List Orders (Shopkeeper sees all; Customer sees their own)
app.get('/api/orders', (req, res) => {
  const { phone, handle } = req.query;
  const allOrders = Array.from(orders.values()).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  if (phone) {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const filtered = allOrders.filter(
      (o) => o.customerPhone && o.customerPhone.includes(cleanPhone)
    );
    return res.json({ success: true, orders: filtered });
  }

  if (handle) {
    const cleanHandle = handle.toLowerCase();
    const filtered = allOrders.filter(
      (o) => o.customerHandle && o.customerHandle.toLowerCase() === cleanHandle
    );
    return res.json({ success: true, orders: filtered });
  }

  // Shopkeeper view: all orders
  return res.json({ success: true, orders: allOrders });
});

// Create Order
app.post('/api/orders', (req, res) => {
  try {
    const { customerName, customerPhone, customerHandle, pickupTime, extraNotes, items, total } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item.' });
    }

    const token = `OSE-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder = {
      token,
      customerName: customerName || 'Customer',
      customerPhone: customerPhone ? customerPhone.replace(/\D/g, '').slice(-10) : '-',
      customerHandle: customerHandle || '@customer',
      pickupTime: pickupTime || 'Today within 30-45 minutes',
      extraNotes: extraNotes || '',
      items,
      total: Number(total) || items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
      status: 'RECEIVED',
      createdAt: new Date().toISOString()
    };

    orders.set(token, newOrder);

    return res.status(201).json({
      success: true,
      message: 'Pickup order created successfully',
      order: newOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Order Status (Shopkeeper status workflow)
app.patch('/api/orders/:token/status', (req, res) => {
  const { token } = req.params;
  const { status } = req.body; // 'RECEIVED', 'PACKING', 'READY', 'COLLECTED'

  const order = orders.get(token.toUpperCase());
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();
  orders.set(token.toUpperCase(), order);

  return res.json({
    success: true,
    message: `Order #${token} status updated to ${status}`,
    order
  });
});

// -------------------------------------------------------------
// Print & Xerox Queue
// -------------------------------------------------------------
app.get('/api/print-jobs', (req, res) => {
  const { phone } = req.query;
  if (phone) {
    const clean = phone.replace(/\D/g, '').slice(-10);
    return res.json({
      success: true,
      jobs: printJobs.filter(j => j.customerPhone.includes(clean))
    });
  }
  return res.json({ success: true, jobs: printJobs });
});

app.post('/api/print-jobs', (req, res) => {
  const { customerName, customerPhone, customerHandle, fileName, printType, copies, binding, remarks } = req.body;

  const newJob = {
    id: `PRN-${Math.floor(100 + Math.random() * 900)}`,
    customerName: customerName || 'Customer',
    customerPhone: customerPhone || '-',
    customerHandle: customerHandle || '@customer',
    fileName: fileName || 'Document.pdf',
    printType: printType || 'Black & White',
    copies: Number(copies) || 1,
    binding: binding || 'None',
    remarks: remarks || '',
    status: 'QUEUED',
    createdAt: new Date().toISOString()
  };

  printJobs.unshift(newJob);
  return res.status(201).json({ success: true, message: 'Print job submitted to counter queue', job: newJob });
});

// -------------------------------------------------------------
// Travel Ticket Inquiries
// -------------------------------------------------------------
app.get('/api/travel-requests', (req, res) => {
  const { phone } = req.query;
  if (phone) {
    const clean = phone.replace(/\D/g, '').slice(-10);
    return res.json({
      success: true,
      requests: travelRequests.filter(r => r.customerPhone.includes(clean))
    });
  }
  return res.json({ success: true, requests: travelRequests });
});

app.post('/api/travel-requests', (req, res) => {
  const { customerName, customerPhone, travelType, fromCity, toCity, travelDate, passengers, notes } = req.body;

  const newRequest = {
    id: `TRV-${Math.floor(100 + Math.random() * 900)}`,
    customerName: customerName || 'Customer',
    customerPhone: customerPhone || '-',
    travelType: travelType || 'Train',
    fromCity: fromCity || '',
    toCity: toCity || '',
    travelDate: travelDate || '',
    passengers: Number(passengers) || 1,
    notes: notes || '',
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };

  travelRequests.unshift(newRequest);
  return res.status(201).json({ success: true, message: 'Travel booking inquiry received', request: newRequest });
});

// General Store Info & Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', store: STORE_DATA.name, timestamp: new Date().toISOString() });
});

app.get('/api/store', (req, res) => {
  res.json(STORE_DATA);
});

app.listen(PORT, () => {
  console.log(`[OM SHIVAM ENTERPRISES] Backend API listening on port ${PORT}`);
});
