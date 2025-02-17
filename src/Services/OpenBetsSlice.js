import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAPIAuth } from "../../../services/apiInstance";
import { API_ROUTES } from "../../../constants/apiConstants";
import { BASE_URL } from "../Constant/Api";

const initialState = {
  selectedMatchId : null,
  loading : false,
  data : {},
  totalPages : 1,
  error : null,
  totalCount : 0,
  allOpenBets : {
    loading : false,
    data : {},
    error : null,
  }
}

export const fetchOpenBets = createAsyncThunk('openBets', async (page, {getState})=> {
  try {
    console.log(page.id,'page.id')
    const state = getState();
    const selectedMatchId = state?.openBets
    const res = await getAPIAuth(`${BASE_URL}/bet/betHistory?matchId=${page.id}&perPage=50&status=open${page.currentPage ?`&page=${page.currentPage}`: `&page=${1}`}`)
    // const res = await getAPIAuth(`${API_ROUTES.BET_HISTORY}?matchId=${page.id}&status=open${page.currentPage ?`&page=${page.currentPage}`: `&page=${1}`}`)
    return res?.data
    // return res?.data
  } catch (error) {
    console.log('error', error)
  }
})


export const openBetSlice = createSlice({
  name : 'openBet',
  initialState,
  reducers : {
    setMatchId : (state, action)=> {
      state.selectedMatchId = action.payload
    },

    removeMatchId : (state)=> {
      state.selectedMatchId = null
    }
  },
  extraReducers : (builder) => {
    builder.addCase(fetchOpenBets.pending, (state)=> {
      state.loading = true;
    });

    builder.addCase(fetchOpenBets.fulfilled, (state, action)=> {
      state.loading = false;
      state.data = action.payload?.data?.data;
      console.log({"action.payload":action.payload,state})
      state.totalCount = action.payload?.data?.pagination?.totalChildrenCount
      state.totalPages = action.payload?.data?.pagination?.totalPages
    });

    builder.addCase(fetchOpenBets.rejected, (state, action)=> {
      state.loading = false;
      state.data = {};
      state.error = action.payload
    });
    
  }
})

export const {setMatchId, removeMatchId} = openBetSlice.actions

export const openBetReducer =  openBetSlice.reducer