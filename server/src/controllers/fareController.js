/**
 * Fare Controller
 * 
 * Handles fare estimation and attaches calculated fare breakdowns
 * to ride records. Uses real DB data for surge calculation.
 */

import sql from '../config/db.js';
import { isPeakHour, getSurgeMultiplier, calculateFare } from '../utils/fareCalculator.js';

/**
 * @desc    Estimate fare for a ride before booking
 * @route   POST /api/rides/estimate-fare
 * @access  Protected
 */
export const estimateFare = async (req, res) => {
  try {
    const { distanceKm, durationMin, pickupLocation, hasAirportFee, hasTolls } = req.body;

    // ── Validation ──────────────────────────────────────────
    if (!distanceKm || distanceKm <= 0 || distanceKm > 500) {
      return res.status(400).json({ error: 'distanceKm must be between 0 and 500' });
    }
    if (!durationMin || durationMin <= 0 || durationMin > 300) {
      return res.status(400).json({ error: 'durationMin must be between 0 and 300' });
    }
    if (!pickupLocation || typeof pickupLocation.lat !== 'number' || typeof pickupLocation.lng !== 'number') {
      return res.status(400).json({ error: 'pickupLocation must include valid lat and lng numbers' });
    }

    // ── Surge: query real supply/demand from DB ─────────────
    // Active requests = rides in 'pending' status (not yet picked up)
    const [demandResult] = await sql`
      SELECT COUNT(*)::int AS count FROM rides WHERE status = 'pending'
    `;
    const activeRequests = demandResult?.count || 0;

    // Available drivers = users with role 'driver' and is_online = true
    const [supplyResult] = await sql`
      SELECT COUNT(*)::int AS count FROM users WHERE role = 'driver' AND is_online = true
    `;
    const availableDrivers = supplyResult?.count || 0;

    const surgeMultiplier = getSurgeMultiplier(activeRequests, availableDrivers);

    // ── Peak hour check ─────────────────────────────────────
    const isPeak = isPeakHour(new Date());

    // ── Calculate breakdown ─────────────────────────────────
    const fareBreakdown = calculateFare({
      distanceKm,
      durationMin,
      surgeMultiplier,
      isPeak,
      hasTolls: !!hasTolls,
      hasAirportFee: !!hasAirportFee,
    });

    // Include context data for transparency
    res.json({
      ...fareBreakdown,
      _meta: {
        activeRequests,
        availableDrivers,
        demandRatio: availableDrivers > 0
          ? Math.round((activeRequests / availableDrivers) * 100) / 100
          : null,
      },
    });
  } catch (error) {
    console.error('Fare estimation error:', error);
    res.status(500).json({ error: 'Failed to estimate fare' });
  }
};
