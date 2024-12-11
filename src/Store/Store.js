import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './Slice/loginSlice';
import clientReducer from './Slice/AddClientButtonSlice';
import addClientReducer from './Slice/addClientSlice';
import masterReducer from './Slice/masterSlice';
import superAdminFormReducer from "./SuperAdminFormSlice";
import downlineReducer from './downlineSlice';
import createMatchReducer from './createMatchSlice';


export const store = configureStore({
  reducer: {
    login: loginReducer,
    client: clientReducer, 
    addClient: addClientReducer,
    master: masterReducer,
    downline: downlineReducer,
    createMatch: createMatchReducer,  
    delete: deleteReducer,
  },
});






