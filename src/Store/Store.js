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
import sessionReducer from '../Store/Slice/SessionSlice';


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
    sessions: sessionReducer,
  },
});






