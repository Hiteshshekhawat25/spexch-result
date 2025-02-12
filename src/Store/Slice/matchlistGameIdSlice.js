import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";
import { BASE_URL } from "../../Constant/Api";

const initialState = {
  data : null,
  loading : true,
  error : null
}

export const matchListBook = createAsyncThunk('matchList', async (gameId)=> {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${BASE_URL}/match/getmatchesviagameid/${gameId.gameId}`, {
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

export const matchListSlice = createSlice({
  name : 'liability',
  initialState,
  extraReducers : (builder) => {
    builder.addCase(matchListBook.pending, (state)=> {
      state.loading = true
    })
    builder.addCase(matchListBook.fulfilled, (state, action)=> {
      state.loading = false,
      state.error = null,
      state.data = action.payload
    })
    builder.addCase(matchListBook.rejected, (state, action)=> {
      state.loading = false,
      state.error = action.payload,
      state.data = null
    })
  }
})

export  const matchListReducer = matchListSlice.reducer