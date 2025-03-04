import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";
import { BASE_URL } from "../../Constant/Api";

const initialState = {
  data: null,
  total: 0,
  pages: 0,
  loading: true,
  error: null
}
export const liabilityBook = createAsyncThunk('liability', async (data) => {
  try {
    const token = localStorage.getItem("authToken");
    console.log(data,'data12345')
    // Construct the base URL
    let url = `${BASE_URL}/user/get-pending-liability-list?page=${data.page}${data?.fromTime ? `&fromDate=${data?.fromTime}` : ''}${data?.toTime ? `&toDate=${data?.toTime}` : ''}&limit=${data.limit}&sport=${data.sport}&matchId=${data?.matchId}&sessionId=${data?.sessionId}`;

    // Add status and type filters
    if (data?.status === 'settled') {
      url += `&isSettled=${data.status}`;
    } else {
      url += `&deleteStatus=${data?.status}`;
    }

    if (data?.type) {
      url += `&type=${data.type}`;
    }

    // Add fromTime and toTime if provided
    if (data.fromTime) {
      url += `&fromTime=${data.fromTime}`;
    }
    if (data.toTime) {
      url += `&toTime=${data.toTime}`;
    }

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response?.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export const liabilitySlice = createSlice({
  name: 'liability',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(liabilityBook.pending, (state) => {
      state.loading = true
    })
    builder.addCase(liabilityBook.fulfilled, (state, action) => {
      state.loading = false,
        state.error = null,
        state.data = action.payload?.data
      state.total = action.payload?.pagination?.totalBets
      state.pages = action.payload?.pagination?.totalPages
    })
    builder.addCase(liabilityBook.rejected, (state, action) => {
      state.loading = false,
        state.error = action.payload,
        state.data = null
    })
  }
})

export const liabilityReducer = liabilitySlice.reducer