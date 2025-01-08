import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../Constant/Api';
import { toast } from 'react-toastify';

// Thunk to update partnership
export const updatePartnership = createAsyncThunk(
  'partnership/updatePartnership',
  async ({ newPartnership, password, userId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        throw new Error('User is not authenticated. Please log in.');
      }

      const response = await axios.put(
        `${BASE_URL}/user/update-partnership`,
        {
          newPartnership,
          password,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      }
      console.error("Error:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

const partnershipSlice = createSlice({
  name: 'partnership',
  initialState: {
    partnershipData: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updatePartnership.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updatePartnership.fulfilled, (state, action) => {
        state.loading = false;
        state.partnershipData = action.payload;
        state.successMessage = 'Partnership updated successfully.';
      })
      .addCase(updatePartnership.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default partnershipSlice.reducer;
