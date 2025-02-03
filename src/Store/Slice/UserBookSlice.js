import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";
import { BASE_URL } from "../../Constant/Api";

const initialState = {
  data : null,
  loading : true,
  error : null
}

export const fetchUserBook = createAsyncThunk('userBook', async (data)=> {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${BASE_URL}/user/get-user-market-bet?page=${data.page}&limit=${data.limit}&type=${data.type}&matchId=${data.matchId}`, {
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

export const userBookSlice = createSlice({
  name : 'userBook',
  initialState,
  extraReducers : (builder) => {
    builder.addCase(fetchUserBook.pending, (state)=> {
      state.loading = true
    })
    builder.addCase(fetchUserBook.fulfilled, (state, action)=> {
      state.loading = false,
      state.error = null,
      state.data = action.payload
    })
    builder.addCase(fetchUserBook.rejected, (state, action)=> {
      state.loading = false,
      state.error = action.payload,
      state.data = null
    })
  }
})

export const userBookReducer = userBookSlice.reducer