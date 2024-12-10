import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './Slice/loginSlice';
import clientReducer from './Slice/AddClientButtonSlice';
import addClientReducer from './Slice/addClientSlice';
import masterReducer from './Slice/masterSlice';


export const store = configureStore({
  reducer: {
    login: loginReducer, // Matches the slice name
    client: clientReducer, // Matches the slice name
    addClient: addClientReducer, // Matches the slice name
    master: masterReducer, // Matches the slice name
  },
});
