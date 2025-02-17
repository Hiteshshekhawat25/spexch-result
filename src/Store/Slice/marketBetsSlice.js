import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";
import { BASE_URL } from "../../Constant/Api";

const initialState = {
  data : null,
  loading : true,
  error : null
}

// export const fetchMarketBets = createAsyncThunk('marketBets', async (matchId)=> {
//   try {
//     const token = localStorage.getItem("authToken");
//     const response = await axios.get(`${BASE_URL}/user/marketBetHistory?page=${}&perPage=${}&matchId=${matchId}`, {
//       //  const response = await axios.get(`${BASE_URL}/user/marketBetHistory?matchId=${matchId}`, {
//       headers: {
//         "Content-Type": "application/json; charset=utf-8",
//         Accept: "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response?.data;
//   } catch (error) {
//     console.log(error)
//   }
// })
export const fetchMarketBets = createAsyncThunk(
  'marketBets',
  async (data) => { // Destructure the arguments

    console.log(data,'matchId')
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${BASE_URL}/user/marketBetHistory?page=${data.page}&perPage=10&matchId=${data.gameId}`,
        {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      console.log(error);
      throw error; // Ensure the error is thrown so that the rejected action is dispatched
    }
  }
);
export const marketBetSlice = createSlice({
  name : 'marketBets',
  initialState,
  extraReducers : (builder) => {
    builder.addCase(fetchMarketBets.pending, (state)=> {
      state.loading = true
    })
    builder.addCase(fetchMarketBets.fulfilled, (state, action)=> {
      state.loading = false,
      state.error = null,
      state.data = action.payload
    })
    builder.addCase(fetchMarketBets.rejected, (state, action)=> {
      state.loading = false,
      state.error = action.payload,
      state.data = null
    })
  }
})

export const marketBetsReducer = marketBetSlice.reducer