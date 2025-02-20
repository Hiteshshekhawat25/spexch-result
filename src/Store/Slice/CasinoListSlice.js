import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";
import { BASE_URL } from "../../Constant/Api";

const initialState = {
  data : null,
  loading : true,
  error : null
}

export const fetchCasinoList = createAsyncThunk('CasinoList', async (data)=> {
  
    try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${BASE_URL}/casino/importgames/${data.id}?page=${data.page ? data.page : 1}&perPage=${data.perPage ? data.perPage : 10}`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data?.data;
  } catch (error) {
    console.log(error,'error')
  }
})

export const casinoListSlice = createSlice({
  name : 'CasinoList',
  initialState,
  extraReducers : (builder) => {
    builder.addCase(fetchCasinoList.pending, (state)=> {
      state.loading = true
    })
    builder.addCase(fetchCasinoList.fulfilled, (state, action)=> {
      state.loading = false,
      state.error = null,
      state.data = action.payload
    })
    builder.addCase(fetchCasinoList.rejected, (state, action)=> {
      state.loading = false,
      state.error = action.payload,
      state.data = null
    })
  }
})

export const casinoListReducer = casinoListSlice.reducer