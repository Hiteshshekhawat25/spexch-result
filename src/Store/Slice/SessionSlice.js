import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_URL } from '../../Constant/Api';

// Async Thunk for API Call
export const fetchSessions = createAsyncThunk(
  'sessions/fetchSessions',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${BASE_URL}/user/get-match-session?matchId=676b8b7555d4dcc59cf0680b`,
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
      console.log("data", data.data);
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
      .addCase(fetchSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateSession } = sessionSlice.actions;
export const selectSessions = (state) => state.sessions;
export default sessionSlice.reducer;

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { BASE_URL } from '../../Constant/Api';

// // Async Thunk for API Call
// export const fetchSessions = createAsyncThunk(
//   'sessions/fetchSessions',
//   async (_, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await fetch(
//         `${BASE_URL}/user/get-match-session?matchId=676b8b7555d4dcc59cf0680b`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       if (!response.ok) {
//         throw new Error('Failed to fetch session data');
//       }
//       const data = await response.json();
//       console.log("data",data.data);
//       return data.data; 
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// // Redux Slice
// const sessionSlice = createSlice({
//   name: 'sessions',
//   initialState: {
//     sessions: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     updateSession(state, action) {
//       const { sessionId, result } = action.payload;
//       const session = state.sessions.find((s) => s.id === sessionId);
//       if (session) {
//         session.result = result; // Update the result of the session
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchSessions.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchSessions.fulfilled, (state, action) => {
//         state.loading = false;
//         state.sessions = action.payload;
//       })
//       .addCase(fetchSessions.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { updateSession } = sessionSlice.actions;
// export const selectSessions = (state) => state.sessions;
// export default sessionSlice.reducer;

