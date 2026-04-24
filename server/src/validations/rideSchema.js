import { z } from 'zod';

export const requestRideSchema = z.object({
  pickup_address: z.string().min(3, 'Pickup address is required'),
  destination_address: z.string().min(3, 'Destination address is required'),
  pickup_lat: z.number(),
  pickup_lng: z.number(),
  destination_lat: z.number(),
  destination_lng: z.number(),
  fare: z.number().positive('Fare must be positive'),
  distance: z.string(),
  duration: z.string(),
  hasAirportFee: z.boolean().optional(),
  hasTolls: z.boolean().optional(),
});

export const updateRideStatusSchema = z.object({
  status: z.enum(['pending', 'accepted', 'in_progress', 'completed', 'cancelled']),
  driver_id: z.number().optional(),
});
