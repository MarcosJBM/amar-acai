import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  userId: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  userId: localStorage.getItem('userId'),
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; userId: string }>,
    ) => {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.isAuthenticated = true;

      // TODO: move this logic to another file
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('userId', action.payload.userId);
      localStorage.setItem('isAuthenticated', 'true');
    },
    logout: state => {
      state.token = null;
      state.userId = null;
      state.isAuthenticated = false;

      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('isAuthenticated');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
