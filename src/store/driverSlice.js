import { createSlice } from '@reduxjs/toolkit';

// Initial state, with persistence from localStorage
const initialState = {
  isOnline: localStorage.getItem('isOnline') === 'false' ? false : true, // Default to true if not set
};

const driverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {
    toggleOnline: (state) => {
      state.isOnline = !state.isOnline;
      localStorage.setItem('isOnline', state.isOnline);
    },
    setOnline: (state, action) => {
      state.isOnline = action.payload;
      localStorage.setItem('isOnline', state.isOnline);
    },
  },
});

export const { toggleOnline, setOnline } = driverSlice.actions;
export default driverSlice.reducer;
