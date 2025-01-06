import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../Constant/Api';

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

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Failed to update the partnership');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
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
