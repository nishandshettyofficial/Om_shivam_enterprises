import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// In-memory orders database
const orders = new Map();

// Store Configuration
const STORE_DATA = {
  name: "OM SHIVAM ENTERPRISES",
  phone: "919876543210",
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

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    store: STORE_DATA.name,
    timestamp: new Date().toISOString()
  });
});

// Store Information
app.get('/api/store', (req, res) => {
  res.json(STORE_DATA);
});

// Create In-Store Pickup Order
app.post('/api/orders', (req, res) => {
  try {
    const { customerName, customerPhone, pickupTime, extraNotes, items, total } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item.' });
    }

    const token = `OSE-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder = {
      token,
      customerName: customerName || 'Valued Patron',
      customerPhone: customerPhone || '-',
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

// Retrieve Order by Token
app.get('/api/orders/:token', (req, res) => {
  const { token } = req.params;
  const order = orders.get(token.toUpperCase());

  if (!order) {
    return res.status(404).json({ error: 'Order token not found' });
  }

  return res.json({ success: true, order });
});

app.listen(PORT, () => {
  console.log(`[OM SHIVAM ENTERPRISES] Backend API listening on port ${PORT}`);
});
