import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../Constant/Api';
import { toast } from 'react-toastify';

export const updateCreditReference = createAsyncThunk(
  'credit/updateCreditReference',
  async ({ username, newCreditRef, password, userId }, { rejectWithValue }) => {
    try {
      console.log("hello");
      const token = localStorage.getItem('authToken');

      if (!token) {
        throw new Error('User is not authenticated. Please log in.');
      }

      const response = await axios.put(
        `${BASE_URL}/user/update-credit-reference`,
        {
          username,
          newCreditReference: newCreditRef,
          password,
          userId
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

// Create slice
const creditSlice = createSlice({
  name: 'credit',
  initialState: {
    creditRef: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateCreditReference.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCreditReference.fulfilled, (state, action) => {
        state.loading = false;
        state.creditRef = action.payload;
      })
      .addCase(updateCreditReference.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default creditSlice.reducer;
