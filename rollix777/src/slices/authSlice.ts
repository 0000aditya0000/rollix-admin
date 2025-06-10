import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: { id: string; name: string } | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Load initial state from localStorage (if available)
const loadInitialState = (): AuthState => {
  const token = localStorage.getItem("userToken");
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  return {
    user: token && userId && userName ? { id: userId, name: userName } : null,
    token: token || null,
    isAuthenticated: !!token, // Set to true if token exists
  };
};

const initialState: AuthState = loadInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        user: { id: string; name: string };
        token: string;
      }>
    ) => {
      const { user, token } = action.payload;

      // Update state
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;

      // Save to localStorage
      localStorage.setItem("userToken", token);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userName", user.name);
    },
    logout: (state) => {
      // Clear state
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // Remove auth-related items from localStorage
      localStorage.removeItem("userToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
    },
    checkAuth: (state) => {
      // Check if the token exists in localStorage
      const token = localStorage.getItem("userToken");
      const userId = localStorage.getItem("userId");
      const userName = localStorage.getItem("userName");

      if (token && userId && userName) {
        state.user = { id: userId, name: userName };
        state.token = token;
        state.isAuthenticated = true;
      } else {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      }
    },
  },
});

export const { login, logout, checkAuth } = authSlice.actions;
export default authSlice.reducer;