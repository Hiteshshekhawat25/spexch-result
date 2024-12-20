import { createSlice } from '@reduxjs/toolkit';
const bannerSlice = createSlice({
    name: 'banners',
    initialState: {
      banners: [],
    },
    reducers: {
      setBanners: (state, action) => {
        state.banners = action.payload;
      },
      addBanner: (state, action) => {
        state.banners = [...state.banners, action.payload]; // Add new banner to the list
      },
      deleteBanner: (state, action) => {
        // Filter out the banner with the matching _id
        state.banners = state.banners.filter(banner => banner._id !== action.payload);
      },
      updateBanner: (state, action) => {
        const index = state.banners.findIndex(banner => banner._id === action.payload._id);
        if (index !== -1) {
          state.banners[index] = action.payload;
        }
      },
    },
  });
  
  export const { setBanners, addBanner, deleteBanner, updateBanner } = bannerSlice.actions;
  
  export default bannerSlice.reducer;
  
// import { createSlice } from '@reduxjs/toolkit';

// const bannerSlice = createSlice({
//   name: 'banners',
//   initialState: {
//     banners: {},  // Default to an object
//     selectedBanner: null,
//   },
//   reducers: {
//     setBanners: (state, action) => {
//       console.log("Setting banners:", action.payload);
//       state.banners = action.payload || {};  // Make sure it's an object
//     },
//     addBanner: (state, action) => {
//       state.banners[action.payload._id] = action.payload; // Store by _id as the key
//     },
//     deleteBanner: (state, action) => {
//       const { [action.payload]: deleted, ...remainingBanners } = state.banners;
//       state.banners = remainingBanners; // Remove the banner by _id
//     },
//     updateBanner: (state, action) => {
//       state.banners[action.payload._id] = action.payload; // Update the banner by _id
//     },
//   },
// });

// export const { setBanners, addBanner, deleteBanner, updateBanner } = bannerSlice.actions;
// export default bannerSlice.reducer;
