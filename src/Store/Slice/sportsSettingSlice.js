// Async thunks
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from "../../Constant/Api";

export const fetchSportsList = createAsyncThunk(
  "sportsSettings/fetchSportsList",
  async ({ rejectWithValue }) => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get(`${BASE_URL}/games/getgames`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response?.data?.data;
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

export const fetchUserGameStatusThunk = createAsyncThunk(
  "sportsSettings/fetchUserGameStatus",
  async ({ userId }, { rejectWithValue }) => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get(
        `${BASE_URL}/user/user-game-status/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },

        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user game status");
    }
  }
);

const sportsSettingSlice = createSlice({
  name: "sportsSettings",
  initialState: {
    sportsList: [],
    loading: false,
    error: null,
    userGameStatus: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch sports list
      .addCase(fetchSportsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSportsList.fulfilled, (state, action) => {
        state.loading = false;

        // Transform sportsList from API
        const sportsList = action.payload.map(({ gameId, name }) => ({
          gameId,
          name,
          isChecked: false, // Default to false
        }));

        // Merge with userGameStatus if available
        if (state.userGameStatus) {
          sportsList.forEach((game) => {
            const userStatus = state.userGameStatus.find(
              (status) => status.gameId === game.gameId
            );
            if (userStatus) {
              game.isChecked = userStatus.active;
            }
          });
        }

        state.sportsList = sportsList;
      })
      .addCase(fetchSportsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateGameStatusThunk.fulfilled, (state, action) => {
        const { gameId, isChecked } = action.payload;
        const sport = state.sportsList.find((sport) => sport.gameId === gameId);
        if (sport) sport.isChecked = isChecked;
      })
      .addCase(fetchUserGameStatusThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.userGameStatus = null;
      })
      .addCase(fetchUserGameStatusThunk.fulfilled, (state, action) => {
        state.loading = false;

        // Transform userGameStatus from API
        const userGameStatus = action.payload.map(({ gameId, active }) => ({
          gameId,
          active,
        }));

        state.userGameStatus = userGameStatus;

        // Update sportsList if already loaded
        if (state.sportsList.length > 0) {
          state.sportsList.forEach((game) => {
            const userStatus = userGameStatus.find(
              (status) => status.gameId === game.gameId
            );
            if (userStatus) {
              game.isChecked = userStatus.active;
            }
          });
        }
      })
      .addCase(fetchUserGameStatusThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.userGameStatus = null;
      });
  },
});

export default sportsSettingSlice.reducer;

