import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import accountReducer from './slices/accountSlice';
import transactionReducer from './slices/transactionSlice';
import { setTokenGetter } from '../api/axiosConfig';

const store = configureStore({
  reducer: {
    auth: authReducer,
    account: accountReducer,
    transaction: transactionReducer,
    },
  middleware: (getDefaultMiddleware) =>{
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  }
});

setTokenGetter(() => store.getState().auth.token);

export default store;