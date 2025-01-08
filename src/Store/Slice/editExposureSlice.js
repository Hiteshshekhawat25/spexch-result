import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../Constant/Api';
import { toast } from 'react-toastify';

// Thunk to update exposure
export const updateExposure = createAsyncThunk(
  'exposure/updateExposure',
  async ({ userId, newExposureLimit, password }, { rejectWithValue }) => {
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

const exposureSlice = createSlice({
  name: 'exposure',
  initialState: {
    exposure: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateExposure.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateExposure.fulfilled, (state, action) => {
        state.loading = false;
        state.exposure = action.payload;
        console.log("update exposure", action.payload);
      })
      .addCase(updateExposure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default exposureSlice.reducer;
