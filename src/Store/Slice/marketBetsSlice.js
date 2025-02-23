import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";
import { BASE_URL } from "../../Constant/Api";

const initialState = {
  data: null,
  loading: true,
  error: null
}

export const fetchMarketBets = createAsyncThunk(
  "marketBets",
  async (data) => {
    try {
      const token = localStorage.getItem("authToken");
      console.log(data?.matchId,'==============================12')
      // Construct base URL
      let url = `${BASE_URL}/user/marketBetHistory?matchId=${data?.matchId}`;

      // Append search query if available
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("AAPI", response?.data);

      return response?.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }
);
export const marketBetSlice = createSlice({
  name: 'marketBets',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchMarketBets.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchMarketBets.fulfilled, (state, action) => {
      state.loading = false,
        state.error = null,
        state.data = action.payload
    })
    builder.addCase(fetchMarketBets.rejected, (state, action) => {
      state.loading = false,
        state.error = action.payload,
        state.data = null
    })
  }
})

export const marketBetsReducer = marketBetSlice.reducer