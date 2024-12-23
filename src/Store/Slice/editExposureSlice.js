import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../Constant/Api';

// Thunk to update exposure
export const updateExposure = createAsyncThunk(
  'exposure/updateExposure',
  async ({ userId, newExposureLimit,password }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        throw new Error('User is not authenticated. Please log in.');
      }

      const response = await axios.put(
        `${BASE_URL}/user/update-exposure-limit`,
        { 
          userId, 
          newExposureLimit,
          password
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
        throw new Error('Failed to update the exposure');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create slice
const exposureSlice = createSlice({
  name: 'exposure',
  initialState: {
    exposure: null, // Store the exposure value
    loading: false,
    error: null, // Store the error message if any
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateExposure.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateExposure.fulfilled, (state, action) => {
        state.loading = false;
        state.exposure = action.payload; // Assuming response contains the updated exposure
      })
      .addCase(updateExposure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store the error message
      });
  },
});

export default exposureSlice.reducer;
