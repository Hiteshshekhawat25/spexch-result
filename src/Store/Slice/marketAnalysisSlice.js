import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";
import { BASE_URL } from "../../Constant/Api";

const initialState = {
  data : null,
  loading : true,
  error : null
}

export const fetchMarketList = createAsyncThunk('marketList', async ()=> {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${BASE_URL}/user/getMarketBetCounts`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data?.data;
  } catch (error) {
    console.log(error)
  }
})

export const marketSlice = createSlice({
  name : 'marketList',
  initialState,
  extraReducers : (builder) => {
    builder.addCase(fetchMarketList.pending, (state)=> {
      state.loading = true
    })
    builder.addCase(fetchMarketList.fulfilled, (state, action)=> {
      state.loading = false,
      state.error = null,
      state.data = action.payload
    })
    builder.addCase(fetchMarketList.rejected, (state, action)=> {
      state.loading = false,
      state.error = action.payload,
      state.data = null
    })
  }
})

export const marketListReducer = marketSlice.reducer