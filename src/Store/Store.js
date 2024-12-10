import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './loginSlice';
import clientReducer from './AddClient';
import AddClientForm from '../Pages/Add/AddClientForm';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    client: clientReducer,
    Addclient: addClientReducer,
  },
});
