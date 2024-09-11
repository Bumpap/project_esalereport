// store/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,
    accessToken: null,
  },
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
});

export const { setProfile, setAccessToken } = userSlice.actions;

export default userSlice.reducer;
