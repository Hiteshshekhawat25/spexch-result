// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { getGamesList, updateGameStatus } from "../../Services/Downlinelistapi";

// // const token = localStorage.getItem('authToken');


// // Async thunk for fetching sports data
// export const fetchSportsList = createAsyncThunk(
//   "sports/fetchSportsList",
//   async (token, { rejectWithValue }) => {
//     console.log("token inside",token);
//     try {
//       const response = await getGamesList(token);
//       return response?.data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// // Async thunk for updating game status
// export const updateGameStatusThunk = createAsyncThunk(
//   "sports/updateGameStatus",
//   async ({ token, userId, gameId, isChecked }, { dispatch, rejectWithValue }) => {
//     try {
//       const response = await updateGameStatus(token, userId, gameId, isChecked);
//       dispatch(fetchSportsList(token)); 
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const sportsSlice = createSlice({
//   name: "sports",
//   initialState: {
//     sportsList: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchSportsList.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchSportsList.fulfilled, (state, action) => {
//         state.loading = false;
//         state.sportsList = action.payload.map((game) => ({
//           id: game.id,
//           name: game.name || "Unnamed Game",
//           isChecked: game.isEnabled || false,
//         }));
//       })
//       .addCase(fetchSportsList.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(updateGameStatusThunk.rejected, (state, action) => {
//         state.error = action.payload;
//       });
//   },
// });

// export default sportsSlice.reducer;

// Async thunks
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from "../../Constant/Api";

export const fetchSportsList = createAsyncThunk(
  "sportsSettings/fetchSportsList",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/v1/user/get-sports-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch sports list");
    }
  }
);

export const updateGameStatusThunk = createAsyncThunk(
  "sportsSettings/updateGameStatus",
  async ({ token, userId, gameId, isChecked }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/user/user-game-status`,
        { userId, gameId, active: isChecked },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { gameId, isChecked };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update game status");
    }
  }
);

const sportsSettingSlice = createSlice({
  name: "sportsSettings",
  initialState: {
    sportsList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSportsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSportsList.fulfilled, (state, action) => {
        state.loading = false;
        state.sportsList = action.payload.map((game) => ({
          gameId: game.gameId,
          name: game.name,
          isChecked: game.isEnabled,
        }));
      })
      .addCase(fetchSportsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateGameStatusThunk.fulfilled, (state, action) => {
        const { gameId, isChecked } = action.payload;
        const sport = state.sportsList.find((sport) => sport.gameId === gameId);
        if (sport) sport.isChecked = isChecked;
      });
  },
});

export default sportsSettingSlice.reducer;
