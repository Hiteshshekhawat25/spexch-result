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

export const store = configureStore({
  reducer: {
    // login: loginReducer,
    login: authLoginReducer,
    client: clientReducer, 
    // addClient: addClientReducer,
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
    banners: bannerReducer
  },
});






