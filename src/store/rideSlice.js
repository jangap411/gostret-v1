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
    clearRide: (state) => {
      return initialState;
    },
  },
});

export const { setPickup, setDestination, clearRide } = rideSlice.actions;
export default rideSlice.reducer;
