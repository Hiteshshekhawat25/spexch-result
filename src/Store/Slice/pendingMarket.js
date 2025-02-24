import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";
import { BASE_URL } from "../../Constant/Api";

const initialState = {
  data : null,
  total : 0,
  pages : 0,
  loading : true,
  error : null
}

export const pendingMarketBook = createAsyncThunk('pendingMarket', async (data)=> {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${BASE_URL}/user/get-pending-bets?matchId=${data?.matchId}`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    console.log(error)
  }
})

export const pendingMarketSlice = createSlice({
  name : 'pendingLiability',
  initialState,
  extraReducers : (builder) => {
    builder.addCase(pendingMarketBook.pending, (state)=> {
      state.loading = true
    })
    builder.addCase(pendingMarketBook.fulfilled, (state, action)=> {
      state.loading = false,
      state.error = null,
      state.data = action.payload?.data
      state.total = action.payload?.pagination?.totalBets
      state.pages = action.payload?.pagination?.totalPages
    })
    builder.addCase(pendingMarketBook.rejected, (state, action)=> {
      state.loading = false,
      state.error = action.payload,
      state.data = null
    })
  }
})

export  const pendingMarketReducer = pendingMarketSlice.reducer