import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rideService } from '../services/api';

export const useActiveRide = () => {
  const token = localStorage.getItem('token');
  return useQuery({
    queryKey: ['activeRide'],
    queryFn: () => rideService.getActiveRide(token),
    enabled: !!token,
    staleTime: 10000, // 10 seconds
  });
};

export const useRideHistory = () => {
  const token = localStorage.getItem('token');
  return useQuery({
    queryKey: ['rideHistory'],
    queryFn: () => rideService.getRideHistory(token),
    enabled: !!token,
  });
};

export const useRequestRide = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');
  return useMutation({
    mutationFn: (rideData) => rideService.requestRide(rideData, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeRide'] });
    },
  });
};

export const useUpdateRideStatus = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');
  return useMutation({
    mutationFn: ({ id, status, driverId }) => 
      rideService.updateRideStatus(id, status, token, driverId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['activeRide'] });
      queryClient.setQueryData(['activeRide'], data);
    },
  });
};
