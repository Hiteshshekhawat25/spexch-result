import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../Constant/Api";

// Async thunk for updating user status
export const updateUserStatusThunk = createAsyncThunk(
  "accountStatus/updateUserStatus",
  async ({ userId, newStatus, password }, { rejectWithValue }) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.put(
        `${BASE_URL}/user/update-user-status`,
        { userId, newStatus, password },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update user status");
    }
  }
);

const accountStatusSlice = createSlice({
  name: "accountStatus",
  initialState: {
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    resetStatusState: (state) => {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserStatusThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateUserStatusThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || "Status updated successfully";
      })
      .addCase(updateUserStatusThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetStatusState } = accountStatusSlice.actions;

export default accountStatusSlice.reducer;
