import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import accountReducer from './slices/accountSlice';
import transactionReducer from './slices/transactionSlice';

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

export default store;