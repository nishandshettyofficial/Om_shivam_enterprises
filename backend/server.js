import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabase, testConnection } from './supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// In-Memory Fallback State (used if Supabase is offline or tables not yet migrated)
const memoryUsers = new Map();
const memoryOrders = new Map();
const memoryVerificationCodes = new Map();
const memoryPrintJobs = [];
const memoryTravelRequests = [];

// Seed Default Accounts into Memory
memoryUsers.set('8147228162', {
  phone: '8147228162',
  email: 'admin@omshivam.com',
  handle: '@om_shivam_admin',
  name: 'Store Manager',
  pin: '1234',
  role: 'shopkeeper',
  createdAt: new Date().toISOString()
});

memoryUsers.set('918147228162', {
  phone: '918147228162',
  email: 'admin@omshivam.com',
  handle: '@om_shivam_admin',
  name: 'Store Manager',
  pin: '1234',
  role: 'shopkeeper',
  createdAt: new Date().toISOString()
});

memoryUsers.set('9876543210', {
  phone: '9876543210',
  email: 'rahul@gmail.com',
  handle: '@rahul_01',
  name: 'Rahul Sharma',
  pin: '1234',
  role: 'customer',
  createdAt: new Date().toISOString()
});

// Seed Initial Sample Order
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
  status: 'RECEIVED',
  createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
};
memoryOrders.set(sampleOrder1.token, sampleOrder1);

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
app.get('/api/auth/check-handle/:handle', async (req, res) => {
  const handle = req.params.handle.toLowerCase().startsWith('@')
    ? req.params.handle.toLowerCase()
    : `@${req.params.handle.toLowerCase()}`;

  try {
    const { data, error } = await supabase
      .from('users')
      .select('handle')
      .ilike('handle', handle)
      .maybeSingle();

    if (!error && data) {
      return res.json({ available: false, message: `${handle} is already taken!` });
    }
    if (!error && !data) {
      return res.json({ available: true, message: `${handle} is available!` });
    }
  } catch (err) {
    console.warn('[Supabase fallback] check-handle falling back to memory:', err.message);
  }

  // Fallback to memory
  for (const user of memoryUsers.values()) {
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
  const code = Math.floor(1000 + Math.random() * 9000).toString();

  memoryVerificationCodes.set(cleanPhone, {
    code,
    phone: cleanPhone,
    handle: handle || '@customer',
    expiresAt: Date.now() + 10 * 60 * 1000
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
app.post('/api/auth/register', async (req, res) => {
  const { phone, email, handle, pin, name, password } = req.body;
  const userPin = pin || password;

  if (!phone || !userPin) {
    return res.status(400).json({ error: 'Valid 10-digit mobile number and PIN/password are required.' });
  }

  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  if (cleanPhone.length !== 10) {
    return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number.' });
  }

  let cleanHandle = handle ? (handle.startsWith('@') ? handle.toLowerCase() : `@${handle.toLowerCase()}`) : null;
  if (!cleanHandle) {
    if (name) {
      cleanHandle = `@${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    } else {
      cleanHandle = `@user_${cleanPhone.slice(-4)}`;
    }
  }

  const role = (cleanPhone === '8147228162' || cleanPhone === '918147228162' || cleanHandle === '@om_shivam_admin')
    ? 'shopkeeper'
    : 'customer';

  const userPayload = {
    phone: cleanPhone,
    email: email || '',
    handle: cleanHandle,
    name: name?.trim() || cleanHandle.replace('@', ''),
    pin: userPin.toString(),
    role
  };

  try {
    // Check if user already exists in Supabase
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('phone', cleanPhone)
      .maybeSingle();

    if (existingUser) {
      return res.status(409).json({ error: 'An account with this mobile number already exists. Please sign in.' });
    }

    // Insert into Supabase
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([userPayload])
      .select()
      .single();

    if (!insertError && newUser) {
      memoryUsers.set(cleanPhone, newUser);
      return res.status(201).json({
        success: true,
        message: 'Account created successfully (Saved to Supabase)',
        user: {
          phone: newUser.phone,
          email: newUser.email,
          handle: newUser.handle,
          name: newUser.name,
          role: newUser.role
        }
      });
    }
  } catch (err) {
    console.warn('[Supabase fallback] registration using memory:', err.message);
  }

  // Memory Fallback
  if (memoryUsers.has(cleanPhone)) {
    return res.status(409).json({ error: 'An account with this mobile number already exists. Please sign in.' });
  }

  const memoryNewUser = {
    ...userPayload,
    createdAt: new Date().toISOString()
  };
  memoryUsers.set(cleanPhone, memoryNewUser);

  return res.status(201).json({
    success: true,
    message: 'Account created successfully',
    user: {
      phone: memoryNewUser.phone,
      email: memoryNewUser.email,
      handle: memoryNewUser.handle,
      name: memoryNewUser.name,
      role: memoryNewUser.role
    }
  });
});

// Login User / Shopkeeper
app.post('/api/auth/login', async (req, res) => {
  const { identifier, pin, password } = req.body;
  const userPin = pin || password;

  if (!identifier || !userPin) {
    return res.status(400).json({ error: 'Mobile number/email and PIN/password are required.' });
  }

  const cleanInput = identifier.trim().toLowerCase();
  const digitsOnly = cleanInput.replace(/\D/g, '').slice(-10);

  // Try Supabase first
  try {
    let query = supabase.from('users').select('*');
    if (digitsOnly && digitsOnly.length === 10) {
      query = query.or(`phone.eq.${digitsOnly},email.ilike.${cleanInput},handle.ilike.${cleanInput}`);
    } else {
      query = query.or(`email.ilike.${cleanInput},handle.ilike.${cleanInput}`);
    }

    const { data: usersFound, error } = await query;
    if (!error && usersFound && usersFound.length > 0) {
      const foundUser = usersFound[0];
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
    }
  } catch (err) {
    console.warn('[Supabase fallback] login using memory:', err.message);
  }

  // Memory Fallback
  let foundUser = null;
  for (const user of memoryUsers.values()) {
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
app.post('/api/auth/reset-pin', async (req, res) => {
  const { phone, newPin, verificationCode } = req.body;
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);

  const stored = memoryVerificationCodes.get(cleanPhone);
  if (!stored || stored.code !== verificationCode.toString()) {
    return res.status(400).json({ error: 'Invalid or expired verification code.' });
  }

  // Try updating in Supabase
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ pin: newPin.toString() })
      .eq('phone', cleanPhone)
      .select();

    if (!error && data && data.length > 0) {
      memoryVerificationCodes.delete(cleanPhone);
      return res.json({ success: true, message: 'PIN updated successfully in Supabase! You can now log in.' });
    }
  } catch (err) {
    console.warn('[Supabase fallback] reset-pin using memory:', err.message);
  }

  // Memory Fallback
  const user = memoryUsers.get(cleanPhone);
  if (!user) {
    return res.status(404).json({ error: 'No account found for this mobile number.' });
  }

  user.pin = newPin.toString();
  memoryUsers.set(cleanPhone, user);
  memoryVerificationCodes.delete(cleanPhone);

  return res.json({ success: true, message: 'PIN updated successfully! You can now log in.' });
});

// -------------------------------------------------------------
// Orders Endpoints
// -------------------------------------------------------------

// List Orders
app.get('/api/orders', async (req, res) => {
  const { phone, handle } = req.query;

  // Try Supabase first
  try {
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });

    if (phone) {
      const cleanPhone = phone.replace(/\D/g, '').slice(-10);
      query = query.ilike('customer_phone', `%${cleanPhone}%`);
    } else if (handle) {
      query = query.ilike('customer_handle', handle.toLowerCase());
    }

    const { data, error } = await query;
    if (!error && data) {
      const formatted = data.map(o => ({
        token: o.token,
        customerName: o.customer_name,
        customerPhone: o.customer_phone,
        customerHandle: o.customer_handle,
        pickupTime: o.pickup_time,
        extraNotes: o.extra_notes,
        items: o.items || [],
        total: Number(o.total) || 0,
        status: o.status,
        createdAt: o.created_at,
        updatedAt: o.updated_at
      }));
      return res.json({ success: true, orders: formatted });
    }
  } catch (err) {
    console.warn('[Supabase fallback] orders fetch using memory:', err.message);
  }

  // Memory Fallback
  const allOrders = Array.from(memoryOrders.values()).sort(
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

  return res.json({ success: true, orders: allOrders });
});

// Create Order
app.post('/api/orders', async (req, res) => {
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

    // Save to Supabase
    try {
      const { data, error } = await supabase.from('orders').insert([{
        token: newOrder.token,
        customer_name: newOrder.customerName,
        customer_phone: newOrder.customerPhone,
        customer_handle: newOrder.customerHandle,
        pickup_time: newOrder.pickupTime,
        extra_notes: newOrder.extraNotes,
        items: newOrder.items,
        total: newOrder.total,
        status: newOrder.status
      }]).select().single();

      if (!error && data) {
        memoryOrders.set(token, newOrder);
        return res.status(201).json({
          success: true,
          message: 'Pickup order created successfully (Saved to Supabase)',
          order: newOrder
        });
      }
    } catch (err) {
      console.warn('[Supabase fallback] order creation using memory:', err.message);
    }

    // Memory Fallback
    memoryOrders.set(token, newOrder);
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

// Update Order Status
app.patch('/api/orders/:token/status', async (req, res) => {
  const { token } = req.params;
  const { status } = req.body;

  try {
    const { data, error } = await supabase
      .from('orders')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('token', token.toUpperCase())
      .select()
      .single();

    if (!error && data) {
      const updatedOrder = {
        token: data.token,
        customerName: data.customer_name,
        customerPhone: data.customer_phone,
        customerHandle: data.customer_handle,
        pickupTime: data.pickup_time,
        extraNotes: data.extra_notes,
        items: data.items || [],
        total: Number(data.total) || 0,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      memoryOrders.set(token.toUpperCase(), updatedOrder);
      return res.json({
        success: true,
        message: `Order #${token} status updated to ${status} (Supabase)`,
        order: updatedOrder
      });
    }
  } catch (err) {
    console.warn('[Supabase fallback] update order status using memory:', err.message);
  }

  // Memory Fallback
  const order = memoryOrders.get(token.toUpperCase());
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();
  memoryOrders.set(token.toUpperCase(), order);

  return res.json({
    success: true,
    message: `Order #${token} status updated to ${status}`,
    order
  });
});

// -------------------------------------------------------------
// Print & Xerox Queue
// -------------------------------------------------------------
app.get('/api/print-jobs', async (req, res) => {
  const { phone } = req.query;

  try {
    let query = supabase.from('print_jobs').select('*').order('created_at', { ascending: false });
    if (phone) {
      const clean = phone.replace(/\D/g, '').slice(-10);
      query = query.ilike('customer_phone', `%${clean}%`);
    }

    const { data, error } = await query;
    if (!error && data) {
      const formatted = data.map(j => ({
        id: j.id,
        customerName: j.customer_name,
        customerPhone: j.customer_phone,
        customerHandle: j.customer_handle,
        fileName: j.file_name,
        printType: j.print_type,
        copies: j.copies,
        binding: j.binding,
        remarks: j.remarks,
        status: j.status,
        createdAt: j.created_at
      }));
      return res.json({ success: true, jobs: formatted });
    }
  } catch (err) {
    console.warn('[Supabase fallback] print jobs using memory:', err.message);
  }

  // Memory Fallback
  if (phone) {
    const clean = phone.replace(/\D/g, '').slice(-10);
    return res.json({
      success: true,
      jobs: memoryPrintJobs.filter(j => j.customerPhone.includes(clean))
    });
  }
  return res.json({ success: true, jobs: memoryPrintJobs });
});

app.post('/api/print-jobs', async (req, res) => {
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

  try {
    const { data, error } = await supabase.from('print_jobs').insert([{
      id: newJob.id,
      customer_name: newJob.customerName,
      customer_phone: newJob.customerPhone,
      customer_handle: newJob.customerHandle,
      file_name: newJob.fileName,
      print_type: newJob.printType,
      copies: newJob.copies,
      binding: newJob.binding,
      remarks: newJob.remarks,
      status: newJob.status
    }]).select().single();

    if (!error && data) {
      memoryPrintJobs.unshift(newJob);
      return res.status(201).json({ success: true, message: 'Print job submitted to counter queue (Supabase)', job: newJob });
    }
  } catch (err) {
    console.warn('[Supabase fallback] print job submission using memory:', err.message);
  }

  memoryPrintJobs.unshift(newJob);
  return res.status(201).json({ success: true, message: 'Print job submitted to counter queue', job: newJob });
});

// -------------------------------------------------------------
// Travel Ticket Inquiries
// -------------------------------------------------------------
app.get('/api/travel-requests', async (req, res) => {
  const { phone } = req.query;

  try {
    let query = supabase.from('travel_requests').select('*').order('created_at', { ascending: false });
    if (phone) {
      const clean = phone.replace(/\D/g, '').slice(-10);
      query = query.ilike('customer_phone', `%${clean}%`);
    }

    const { data, error } = await query;
    if (!error && data) {
      const formatted = data.map(r => ({
        id: r.id,
        customerName: r.customer_name,
        customerPhone: r.customer_phone,
        travelType: r.travel_type,
        fromCity: r.from_city,
        toCity: r.to_city,
        travelDate: r.travel_date,
        passengers: r.passengers,
        notes: r.notes,
        status: r.status,
        createdAt: r.created_at
      }));
      return res.json({ success: true, requests: formatted });
    }
  } catch (err) {
    console.warn('[Supabase fallback] travel requests using memory:', err.message);
  }

  // Memory Fallback
  if (phone) {
    const clean = phone.replace(/\D/g, '').slice(-10);
    return res.json({
      success: true,
      requests: memoryTravelRequests.filter(r => r.customerPhone.includes(clean))
    });
  }
  return res.json({ success: true, requests: memoryTravelRequests });
});

app.post('/api/travel-requests', async (req, res) => {
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

  try {
    const { data, error } = await supabase.from('travel_requests').insert([{
      id: newRequest.id,
      customer_name: newRequest.customerName,
      customer_phone: newRequest.customerPhone,
      travel_type: newRequest.travelType,
      from_city: newRequest.fromCity,
      to_city: newRequest.toCity,
      travel_date: newRequest.travelDate,
      passengers: newRequest.passengers,
      notes: newRequest.notes,
      status: newRequest.status
    }]).select().single();

    if (!error && data) {
      memoryTravelRequests.unshift(newRequest);
      return res.status(201).json({ success: true, message: 'Travel booking inquiry received (Supabase)', request: newRequest });
    }
  } catch (err) {
    console.warn('[Supabase fallback] travel request using memory:', err.message);
  }

  memoryTravelRequests.unshift(newRequest);
  return res.status(201).json({ success: true, message: 'Travel booking inquiry received', request: newRequest });
});

// General Store Info & Health Check
app.get('/api/health', async (req, res) => {
  const dbStatus = await testConnection();
  res.json({
    status: 'ok',
    store: STORE_DATA.name,
    supabase: dbStatus.connected ? 'connected' : 'fallback-memory',
    supabaseDetails: dbStatus.connected ? 'Active & Ready' : dbStatus.error,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/store', (req, res) => {
  res.json(STORE_DATA);
});

app.listen(PORT, () => {
  console.log(`[OM SHIVAM ENTERPRISES] Backend API listening on port ${PORT}`);
});
