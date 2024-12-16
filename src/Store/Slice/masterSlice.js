import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Example async thunk to save master data (replace with your actual logic)
export const saveMaster = createAsyncThunk(
  'master/saveMaster', 
  async (formData, { rejectWithValue }) => {
    try {
      // Assuming you make an API call to save the data
      const response = await fetch('/api/saveMaster', { // Replace with your actual API endpoint
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to save master');
      return await response.json(); // Return the response data if success
    } catch (error) {
      return rejectWithValue(error.message); // Handle the error if API call fails
    }
  }
);

const initialState = {
  user: null,
  roles: [],
  settings: {},
  isLoading: false,
  error: null,
};

const masterSlice = createSlice({
  name: 'master',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setRoles: (state, action) => {
      state.roles = action.payload;
    },
    setSettings: (state, action) => {
      state.settings = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveMaster.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(saveMaster.fulfilled, (state, action) => {
        state.isLoading = false;
        // You can handle the response data here
        // state.user = action.payload; // Example: Save response data
      })
      .addCase(saveMaster.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setUser,
  setRoles,
  setSettings,
  setLoading,
  setError,
  clearError,
} = masterSlice.actions;

export default masterSlice.reducer;
