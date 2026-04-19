/**
 * Fare Calculator Utility
 * 
 * Pure functions for computing ride fares including surge pricing,
 * peak-hour multipliers, service fees, and fixed surcharges.
 * 
 * All monetary values are rounded to 2 decimal places.
 */

import { FARE_CONFIG } from '../config/fareConfig.js';

/**
 * Round a number to 2 decimal places (banker-safe).
 */
const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

/**
 * Determine whether a given timestamp falls within peak hours.
 *
 * Peak hours:
 *   Weekdays (Mon–Fri): 7–9 AM, 5–8 PM
 *   Weekends (Sat–Sun): 11 PM – 3 AM (spans midnight)
 *
 * @param {Date|string|number} timestamp — any value parseable by new Date()
 * @returns {boolean}
 */
export function isPeakHour(timestamp) {
  const date = new Date(timestamp);
  const dayOfWeek = date.getDay();        // 0 = Sunday, 6 = Saturday
  const hour = date.getHours();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  const { peakHours } = FARE_CONFIG;

  if (isWeekend) {
    // Weekend peak: check each window (handles the midnight-spanning range)
    return peakHours.weekend.some(
      (window) => hour >= window.start && hour < window.end
    );
  }

  // Weekday peak
  return peakHours.weekday.some(
    (window) => hour >= window.start && hour < window.end
  );
}

/**
 * Calculate the surge multiplier based on supply/demand ratio.
 *
 * @param {number} activeRequests  — count of pending ride requests in the zone
 * @param {number} availableDrivers — count of online drivers in the zone
 * @returns {number} surge multiplier (1.0 – 2.0)
 */
export function getSurgeMultiplier(activeRequests, availableDrivers) {
  // Guard: if no drivers available, apply maximum surge
  if (!availableDrivers || availableDrivers <= 0) {
    return activeRequests > 0 ? FARE_CONFIG.surgeMax : 1.0;
  }

  const ratio = activeRequests / availableDrivers;

  // Walk through tiers in ascending order; first match wins
  for (const tier of FARE_CONFIG.surgeTiers) {
    if (ratio < tier.maxRatio) {
      return tier.multiplier;
    }
  }

  // If ratio exceeds all tier thresholds, apply the cap
  return FARE_CONFIG.surgeMax;
}

/**
 * Calculate the full fare breakdown for a ride.
 *
 * @param {Object} params
 * @param {number} params.distanceKm       — trip distance in kilometres
 * @param {number} params.durationMin      — estimated trip duration in minutes
 * @param {number} params.surgeMultiplier  — dynamic surge multiplier (1.0–2.0)
 * @param {boolean} params.isPeak          — whether peak-hour pricing applies
 * @param {boolean} params.hasTolls        — whether toll charges apply (flat PGK 2.00)
 * @param {boolean} params.hasAirportFee   — whether airport surcharge applies
 * @returns {Object} complete fare breakdown
 */
export function calculateFare({
  distanceKm,
  durationMin,
  surgeMultiplier = 1.0,
  isPeak = false,
  hasTolls = false,
  hasAirportFee = false,
}) {
  const {
    baseFare,
    ratePerKm,
    ratePerMin,
    serviceFeePercent,
    peakMultiplier,
    minimumFare,
    airportFee: airportFeeAmt,
    bookingFee,
  } = FARE_CONFIG;

  // ── Core charges ──────────────────────────────────────────
  const distanceCharge = round2(distanceKm * ratePerKm);
  const timeCharge     = round2(durationMin * ratePerMin);
  const subtotal       = round2(baseFare + distanceCharge + timeCharge);

  // ── Surge ─────────────────────────────────────────────────
  const afterSurge  = round2(subtotal * surgeMultiplier);
  const surgeAmount = round2(afterSurge - subtotal);

  // ── Peak ──────────────────────────────────────────────────
  const peakMul     = isPeak ? peakMultiplier : 1.0;
  const afterPeak   = round2(afterSurge * peakMul);
  const peakAmount  = round2(afterPeak - afterSurge);

  // ── Service fee (15% of the subtotal BEFORE fixed fees) ──
  const serviceFee = round2(afterPeak * serviceFeePercent);

  // ── Fixed fees ────────────────────────────────────────────
  const tolls      = hasTolls ? 2.00 : 0;
  const airportFee = hasAirportFee ? airportFeeAmt : 0;

  // ── Grand total ───────────────────────────────────────────
  let total = round2(afterPeak + serviceFee + tolls + airportFee + bookingFee);

  // ── Minimum fare floor ────────────────────────────────────
  const minimumFareApplied = total < minimumFare;
  if (minimumFareApplied) {
    total = minimumFare;
  }

  return {
    baseFare,
    distanceCharge,
    timeCharge,
    subtotal,
    surgeMultiplier,
    surgeAmount,
    isPeak,
    peakAmount,
    serviceFee,
    tolls,
    airportFee,
    bookingFee,
    total,
    minimumFareApplied,
  };
}
