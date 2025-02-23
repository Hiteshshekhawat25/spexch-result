import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './Slice/loginSlice';
import clientReducer from './Slice/AddClientButtonSlice';
// import addClientReducer from './Slice/addClientSlice';
import masterReducer from './Slice/masterSlice';
import superAdminFormReducer from "./Slice/SuperAdminFormSlice";
import downlineReducer from './Slice/downlineSlice';
import createMatchReducer from './Slice/createMatchSlice';
import deleteReducer from './Slice/deleteSlice';
import createManualMatchReducer from './Slice/createManualMatchSlice';
import allMatchReducer from './Slice/allMatchSlice';
import balanceReducer from './Slice/balanceSlice';
import updateCreditReference from './Slice/creditReferenceslice'
import creditReferenceReducer from './Slice/creditTransactionSlice'
import editStakeReducer from './Slice/editStakeSlice'
import scoreReducer from './Slice/scoreSlice'
import sportsReducer from './Slice/sportsSettingSlice'
import authLoginReducer  from './Slice/authLoginSlice'
import editMatchReducer from './Slice/editMatchSlice'
import bannerReducer from './Slice/bannerSlice';
import profitLossReducer from './Slice/profitLossSlice';
import plFilterReducer from './Slice/plFilterSlice';
import betListFilterReducer from './Slice/betListFilterSlice';
import betListReducer from './Slice/betListSlice';
import profileReducer from './Slice/profileSlice';
import activityLogReducer from './Slice/activityLogSlice';
import accountStatementFilterReducer from './Slice/accountStatementFilterSlice';
import accountStatementReducer from './Slice/accountStatementSlice';
import userReducer from './Slice/userInfoSlice';
import accountStatusReducer from '../Store/Slice/accountStatusSlice';
import eventProfitLossReducer from './Slice/eventProfitLossSlice'; 
import eventFilterReducer from './Slice/eventPLFilterSlice'; 
import eventPLFilterReducer  from './Slice/eventPLFilterSlice'; 
import sessionReducer from '../Store/Slice/SessionSlice';
import partnershipReducer from '../Store/Slice/updatePartnershipSlice'
import { marketListReducer } from './Slice/marketAnalysisSlice';
import { marketBetsReducer } from './Slice/marketBetsSlice';
import { userBookReducer } from './Slice/UserBookSlice';
import { liabilityReducer } from './Slice/liabilitySlice';
import { matchListReducer } from './Slice/matchlistGameIdSlice';
import {  masterBookReducer } from './Slice/masterListSlice';
import { casinoProvidersReducer } from './Slice/casinoProvidersSlice';
import { casinoListReducer } from './Slice/CasinoListSlice';
import { pendingLiabilityReducer } from './Slice/pendingLiability';
import { pendingMarketReducer } from './Slice/pendingMarket';


export const store = configureStore({
  reducer: {
    login: authLoginReducer,
    client: clientReducer, 
    user: userReducer,
    master: masterReducer,
    downline: downlineReducer,
    createMatch: createMatchReducer,  
    createManualMatch: createManualMatchReducer,
    superAdminForm: superAdminFormReducer,
    delete: deleteReducer,
    allMatch: allMatchReducer,
    balance: balanceReducer,
    credit: updateCreditReference,
    creditReference: creditReferenceReducer,
    editStake: editStakeReducer, 
    editMatch: editMatchReducer,
    score: scoreReducer,
    sports: sportsReducer,
    banners: bannerReducer,
    profitLoss: profitLossReducer,
    plFilter: plFilterReducer,
    betListFilter: betListFilterReducer,
    betList: betListReducer,
    profile: profileReducer,
    activityLog: activityLogReducer,
    accountStatementFilter: accountStatementFilterReducer,
    accountStatement: accountStatementReducer,
    accountStatus: accountStatusReducer,
    eventProfitLoss: eventProfitLossReducer, 
    eventFilter: eventFilterReducer,  
    eventPLFilter: eventPLFilterReducer,
    sessions: sessionReducer,
    partnership: partnershipReducer,
    marketList : marketListReducer,
    marketBetList : marketBetsReducer,
    userBookList : userBookReducer,
    liability : liabilityReducer,
    matchlist : matchListReducer,
    masterBook : masterBookReducer,
    casinoProviders : casinoProvidersReducer,
    CasinoList : casinoListReducer,
    pendingLiability : pendingLiabilityReducer,
    pendingMarket : pendingMarketReducer
  },
});






