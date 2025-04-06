// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
    token: null,
    username: null,
    role: null,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = initialState.user;
    },
  },
});


export const { setUser, clearUser } = userSlice.actions;
export const selectUser = (state) => state.user.user;
export default userSlice.reducer;
