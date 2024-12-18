import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../Constant/Api';

// Thunk to fetch credit reference data
export const fetchCreditReference = createAsyncThunk(
    'creditReference/fetchCreditReference',
    async ({ userId, username, page, limit }, { rejectWithValue }) => {
        const token = localStorage.getItem('authToken');

        if (!token) {
            throw new Error('User is not authenticated. Please log in.');
        }
        try {
            const response = await axios.get(
                `${BASE_URL}/user/get-credit-reference/${userId}`,
                {
                    params: {
                        username,
                        page,
                        limit,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("response",response);

            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error('Failed to fetch credit reference data');
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Slice for credit reference data
const creditReferenceSlice = createSlice({
    name: 'creditReference',
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCreditReference.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCreditReference.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload; // Store the fetched data
            })
            .addCase(fetchCreditReference.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Store the error message
            });
    },
});

export default creditReferenceSlice.reducer;
