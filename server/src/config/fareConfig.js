/**
 * Fare Configuration Constants
 * 
 * Central source of truth for all pricing parameters.
 * Amounts are in PGK (Papua New Guinean Kina).
 */

export const FARE_CONFIG = {
  // Base charge applied to every ride
  baseFare: 2.50,

  // Per-kilometre distance rate
  ratePerKm: 3.00,

  // Per-minute time rate
  ratePerMin: 1.25,

  // Platform service fee (percentage of subtotal before fixed fees)
  serviceFeePercent: 0.15,

  // Multiplier applied during peak hours
  peakMultiplier: 1.15,

  // Floor price — if calculated fare is below this, use this instead
  minimumFare: 5.00,

  // Fixed surcharge for airport pickups/drop-offs
  airportFee: 3.50,

  // Fixed booking fee applied to every ride
  bookingFee: 1.00,

  // Surge tier thresholds (demand ratio → multiplier)
  // Sorted ascending — first match wins
  surgeTiers: [
    { maxRatio: 1.2, multiplier: 1.0 },
    { maxRatio: 1.5, multiplier: 1.2 },
    { maxRatio: 2.0, multiplier: 1.5 },
    { maxRatio: 2.5, multiplier: 1.8 },
  ],
  // Cap if ratio exceeds all tiers
  surgeMax: 2.0,

  // Peak hour definitions
  peakHours: {
    // Monday–Friday (0 = Sunday, 1 = Monday … 6 = Saturday)
    weekday: [
      { start: 7, end: 9 },   // 7:00 AM – 9:00 AM
      { start: 17, end: 20 }, // 5:00 PM – 8:00 PM
    ],
    // Saturday & Sunday — late night / early morning
    weekend: [
      { start: 23, end: 24 }, // 11:00 PM – midnight
      { start: 0, end: 3 },   // midnight – 3:00 AM
    ],
  },
};
