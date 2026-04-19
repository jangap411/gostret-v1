import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pickup: {
    query: 'Current location',
    marker: null,
  },
  destination: {
    query: '',
    marker: null,
  },
  activeRide: null,
};

const rideSlice = createSlice({
  name: 'ride',
  initialState,
  reducers: {
    setPickup: (state, action) => {
      state.pickup = action.payload;
    },
    setDestination: (state, action) => {
      state.destination = action.payload;
    },
    setActiveRide: (state, action) => {
      state.activeRide = action.payload;
    },
    updateRideStatus: (state, action) => {
      if (state.activeRide) {
        state.activeRide.status = action.payload.status;
        if (action.payload.driver_id) {
          state.activeRide.driver_id = action.payload.driver_id;
        }
      }
    },
    clearRide: (state) => {
      state.activeRide = null;
      state.pickup = initialState.pickup;
      state.destination = initialState.destination;
    },
  },
});

export const { setPickup, setDestination, setActiveRide, updateRideStatus, clearRide } = rideSlice.actions;
export default rideSlice.reducer;

