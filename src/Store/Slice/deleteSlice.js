// import { createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
// import { BASE_URL } from "../../Constant/Api";

// const deleteSlice = createSlice({
//   name: "delete",
//   initialState: {
//     loading: false,
//     success: false,
//     error: null,
//   },
//   reducers: {
//     deleteStart: (state) => {
//       state.loading = true;
//       state.success = false;
//       state.error = null;
//     },
//     deleteSuccess: (state) => {
//       state.loading = false;
//       state.success = true;
//       state.error = null;
//     },
//     deleteFailure: (state, action) => {
//       state.loading = false;
//       state.success = false;
//       state.error = action.payload;
//     },
//     resetDeleteState: (state) => {
//       state.loading = false;
//       state.success = false;
//       state.error = null;
//     },
//   },
// });

// export const { deleteStart, deleteSuccess, deleteFailure, resetDeleteState } =
//   deleteSlice.actions;

// // Thunk function to delete a user
// export const deleteUser = (userId) => async (dispatch) => {
//   try {
//     dispatch(deleteStart());

//     // Retrieve the token from local storage
//     const token = localStorage.getItem("authToken");

//     if (!token) {
//       throw new Error("Token not found. Please log in again.");
//     }

//     // Make the API call with the token in the Authorization header
//     await axios.delete(`${BASE_URL}/admin/v1/user/delete-user/${userId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     dispatch(deleteSuccess());
//   } catch (error) {
//     dispatch(deleteFailure(error.response?.data || error.message));
//   }
// };

// export default deleteSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const deleteSlice = createSlice({
  name: "delete",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    deleteStart: (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    },
    deleteSuccess: (state) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    },
    deleteFailure: (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
    resetDeleteState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
});

export const { deleteStart, deleteSuccess, deleteFailure, resetDeleteState } = deleteSlice.actions;

export default deleteSlice.reducer;
