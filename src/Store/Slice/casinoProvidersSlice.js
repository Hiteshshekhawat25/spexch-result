import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";
import { BASE_URL } from "../../Constant/Api";

const initialState = {
  data : null,
  loading : true,
  error : null
}

export const fetchCasinoProviders = createAsyncThunk('casinoProviders', async (data)=> {
  
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${BASE_URL}/casino/getproviders`, {
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

export const casinoProvidersSlice = createSlice({
  name : 'casinoProviders',
  initialState,
  extraReducers : (builder) => {
    builder.addCase(fetchCasinoProviders.pending, (state)=> {
      state.loading = true
    })
    builder.addCase(fetchCasinoProviders.fulfilled, (state, action)=> {
      state.loading = false,
      state.error = null,
      state.data = action.payload
    })
    builder.addCase(fetchCasinoProviders.rejected, (state, action)=> {
      state.loading = false,
      state.error = action.payload,
      state.data = null
    })
  }
})

export const casinoProvidersReducer = casinoProvidersSlice.reducer