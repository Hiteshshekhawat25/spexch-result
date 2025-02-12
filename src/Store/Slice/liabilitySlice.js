import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";
import { BASE_URL } from "../../Constant/Api";

const initialState = {
  data : null,
  loading : true,
  error : null
}

export const liabilityBook = createAsyncThunk('liability', async (data)=> {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${BASE_URL}/user/get-pending-liability-list?page=${data.page}&limit=${data.limit}&sport=${data.sport}&matchId=${data?.matchId}&sessionId=${data?.sessionId}&type=${data?.type}`, {
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

export const liabilitySlice = createSlice({
  name : 'liability',
  initialState,
  extraReducers : (builder) => {
    builder.addCase(liabilityBook.pending, (state)=> {
      state.loading = true
    })
    builder.addCase(liabilityBook.fulfilled, (state, action)=> {
      state.loading = false,
      state.error = null,
      state.data = action.payload
    })
    builder.addCase(liabilityBook.rejected, (state, action)=> {
      state.loading = false,
      state.error = action.payload,
      state.data = null
    })
  }
})

export  const liabilityReducer = liabilitySlice.reducer