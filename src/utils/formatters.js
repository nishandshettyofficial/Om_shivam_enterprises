/**
 * OM SHIVAM ENTERPRISES — Data and Text Formatters
 */

import { STORE_CONFIG } from '../constants/store';

/**
 * Format numbers as Indian Rupee amounts
 * @param {number} amount
 * @returns {string} e.g. "₹450"
 */
export function formatCurrency(amount) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Generate a random boutique order token
 * @param {string} prefix
 * @returns {string} e.g. "OSE-482"
 */
export function generateOrderToken(prefix = 'OSE') {
  const num = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${num}`;
}

/**
 * Generate formatted plain text order message for WhatsApp dispatch
 */
export function generateWhatsAppOrderText({
  token,
  cart,
  customerName,
  customerPhone,
  pickupTime,
  extraNotes,
  total
}) {
  const itemsText = cart
    .map(
      (item, index) =>
        `${index + 1}. [${item.product.brand}] ${item.product.name} (Qty: ${item.quantity}) — ₹${item.product.price * item.quantity}`
    )
    .join('\n');

  return (
    `*ORDER FOR SHOP PICKUP — ${STORE_CONFIG.name}*\n` +
    `Pickup Token: #${token}\n` +
    `════════════════════════════════════\n` +
    `Customer: ${customerName || 'Walk-in Patron'}\n` +
    `Phone: ${customerPhone || 'Not provided'}\n` +
    `Collection Window: ${pickupTime}\n\n` +
    `*ORDERED ITEMS:*\n${itemsText}\n\n` +
    `Total Payable: ₹${total} (Pay upon collection at shop)\n` +
    (extraNotes ? `*Additional Notes:* ${extraNotes}\n` : '') +
    `════════════════════════════════════\n` +
    `Please keep this packed and ready. Thank you!`
  );
}

/**
 * Build direct WhatsApp intent URL
 */
export function buildWhatsAppUrl(phone, text) {
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;
}

