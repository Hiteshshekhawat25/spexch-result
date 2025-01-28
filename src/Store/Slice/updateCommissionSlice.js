import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../Constant/Api';
import { toast } from 'react-toastify';

// Thunk to update commission
export const updateCommission = createAsyncThunk(
  'commission/updateCommission',
  async ({ newCommission, password, userId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        throw new Error('User is not authenticated. Please log in.');
      }

      const response = await axios.put(
        `${BASE_URL}/update-commission`,
        {
          newCommission,
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
      console.error('Error:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

const commissionSlice = createSlice({
  name: 'commission',
  initialState: {
    commissionData: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateCommission.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateCommission.fulfilled, (state, action) => {
        state.loading = false;
        state.commissionData = action.payload;
        state.successMessage = 'Commission updated successfully.';
      })
      .addCase(updateCommission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default commissionSlice.reducer;
