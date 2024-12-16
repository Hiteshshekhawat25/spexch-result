import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../Constant/Api';

// Thunk to update credit reference
// Thunk to update credit reference
export const updateCreditReference = createAsyncThunk(
  'credit/updateCreditReference',
  async ({ username, newCreditRef, password, userId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        throw new Error('User is not authenticated. Please log in.');
      }

      const response = await axios.put(
        `${BASE_URL}/admin/v1/user/update-credit-reference`,
        { 
          username, 
          newCreditReference: newCreditRef, // Use the correct key here
          password,
          userId
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
        throw new Error('Failed to update the credit reference');
      }
    } catch (error) {
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
