import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_URL } from '../../Constant/Api';

// Async Thunk for API Call
export const fetchSportBook = createAsyncThunk(
  'sportbook/fetchSportBook',
  async (matchId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${BASE_URL}/user/get-match-sportsbook?matchId=${matchId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        if (response.status === 404) {
          // If 404, return empty array
          return [];
        }
        throw new Error('Failed to fetch session data');
      }
        const data = await response.json();
      
      console.log("data1423", response);
      return data.data; 
    } catch (error) {
      console.log(error,'data1423')
      return rejectWithValue(error.message);
    }
  }
);

// Redux Slice
const sportbookSlice = createSlice({
  name: 'sportbook',
  initialState: {
    sportbook: [],
    loading: false,
    error: null,
  },
  reducers: {
    updateSession(state, action) {
      const { sessionId, selectionId, result } = action.payload;
      const session = state.sessions.find((s) => s.id === sessionId);
      if (session) {
        session.result = result; // Update the result of the session
        session.selectionId = selectionId; // Update the selectionId (if applicable)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSportBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSportBook.fulfilled, (state, action) => {
        console.log(action.payload,'data1423')
        state.loading = false;
        state.sportbook = action.payload;
      })
      .addCase(fetchSportBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateSession } = sportbookSlice.actions;
export const selectSessions = (state) => state.sessions;
export default sportbookSlice.reducer;

