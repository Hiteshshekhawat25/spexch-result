import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_URL } from '../../Constant/Api';

// Async Thunk for API Call
export const fetchSessions = createAsyncThunk(
  'sessions/fetchSessions',
  async (matchId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${BASE_URL}/user/get-match-session?matchId=${matchId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch session data');
      }
      const data = await response.json();
      console.log("data",data.data);
      return data.data; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Redux Slice
const sessionSlice = createSlice({
  name: 'sessions',
  initialState: {
    sessions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        console.log("Fulfilled action payload:", action.payload);
        state.loading = false;
        state.sessions = action.payload;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectSessions = (state) => state.sessions;

export default sessionSlice.reducer;
