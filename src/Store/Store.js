import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './Slice/loginSlice';
import clientReducer from './Slice/AddClientButtonSlice';
import addClientReducer from './Slice/addClientSlice';
import masterReducer from './Slice/masterSlice';
import superAdminFormReducer from "./Slice/SuperAdminFormSlice";
import downlineReducer from './Slice/downlineSlice';
import createMatchReducer from './Slice/createMatchSlice';
import deleteReducer from './Slice/deleteSlice';
import createManualMatchReducer from './Slice/createManualMatchSlice';
import allMatchReducer from './Slice/allMatchSlice';


export const store = configureStore({
  reducer: {
    login: loginReducer,
    client: clientReducer, 
    addClient: addClientReducer,
    master: masterReducer,
    downline: downlineReducer,
    createMatch: createMatchReducer,  
    createManualMatch: createManualMatchReducer,
    superAdminForm: superAdminFormReducer,
    delete: deleteReducer,
    allMatch: allMatchReducer,
  },
});






