import { configureStore } from '@reduxjs/toolkit';
import rideReducer from './rideSlice';
import driverReducer from './driverSlice';

export const store = configureStore({
  reducer: {
    ride: rideReducer,
    driver: driverReducer,
  },
});
