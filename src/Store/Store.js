import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './loginSlice';
import clientReducer from './AddClient';
import deleteReducer from './deleteSlice';
// import AddClientForm from '../Pages/Add/AddClientForm';
import superAdminFormReducer from "./SuperAdminFormSlice";
import downlineReducer from './downlineSlice';
import createMatchReducer from './createMatchSlice';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    client: clientReducer,
    // Addclient: addClientReducer,
    superAdminForm: superAdminFormReducer,
 
    downline: downlineReducer,
    createMatch: createMatchReducer,  
    delete: deleteReducer,
   
  },
});






