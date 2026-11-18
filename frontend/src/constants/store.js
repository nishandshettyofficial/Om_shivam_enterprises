/**
 * OM SHIVAM ENTERPRISES — Central Store Configuration
 * Maintain all contact numbers, Google Maps location, opening hours,
 * and service offerings in this single authoritative source.
 */

export const STORE_CONFIG = {
  name: "OM SHIVAM ENTERPRISES",
  shortName: "Om Shivam",
  monogram: "OS",
  tagline: "Stationery • Xerox & Printing • School & Office Supplies • All Your Daily Needs in One Place",
  subtitle: "Stationery • Xerox & Printing • School & Office Supplies",
  
  // Contact & Location
  phone: "918147228162",
  rawPhone: "8147228162",
  displayPhone: "+91 8147228162",
  whatsappUrl: "https://wa.me/918147228162",
  mapsUrl: "https://maps.app.goo.gl/gBKD1gkP96SNW1VAA",
  
  // Operating Hours
  hours: {
    weekdays: "Mon – Sat: 9:00 AM – 9:30 PM",
    sunday: "Sunday: 10:00 AM – 2:00 PM",
    counterSpeed: "15-Minute Fast Counter Pickup",
    statusText: "Shop Open • 15m Pickup",
  },
  
  // Counter Location
  address: {
    title: "OM SHIVAM ENTERPRISES",
    line1: "Near Polipu, Kapu",
    line2: "Udupi, Karnataka 574106",
    short: "Kapu, Udupi",
    full: "OM SHIVAM ENTERPRISES, Near Polipu, Kapu, Udupi, Karnataka 574106",
  },
  
  // Services
  services: [
    { title: "Genuine Stationery", desc: "Classmate, Parker, Pilot, Casio, Faber-Castell & Brustro." },
    { title: "Xerox & Colour Printing", desc: "High-speed photocopying, thesis spiral binding & color printouts." },
    { title: "Express Counter Pickup", desc: "Pre-assembled and bagged orders ready upon your arrival." }
  ],
  
  // E-Commerce Bag Settings
  cart: {
    freeGiftThreshold: 800,
    freeGiftDescription: "Free document folder on orders over ₹800",
    storageKey: "ose_cart"
  }
};

