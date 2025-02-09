import { createSlice } from '@reduxjs/toolkit';


const currentDate = new Date().toISOString().split('T')[0];

const initialState = {
  type: '',
  sport: '',
  fromDate: currentDate,
  dataSource: '',  
  toDate: currentDate,    
};

const betListFilterSlice = createSlice({
  name: 'betListFilter',
  initialState,
  reducers: {
    setDataSource: (state, action) => {
      console.log(action.payload,'actionjaction')
      state.dataSource = action.payload;
    },
    setType: (state, action) => {
      state.type = action.payload;
    },
    setSport: (state, action) => {
      state.sport = action.payload;
    },
    setFromDate: (state, action) => {
      state.fromDate = action.payload;
    },
    setToDate: (state, action) => {
      state.toDate = action.payload;
    },
    resetBetFilters: (state) => {
      state.type = '';
      state.sport = '';
      state.fromDate = currentDate; // Reset to current date
      state.toDate = currentDate;   // Reset to current date
    },
  },
});

export const { setType, setSport,setDataSource, setFromDate, setToDate, resetBetFilters } = betListFilterSlice.actions;

export const selectBetListFilter = (state) => state.betListFilter;

export default betListFilterSlice.reducer;
