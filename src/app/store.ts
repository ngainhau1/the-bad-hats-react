import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/ProductSlice'
import orderReducer from './slices/orderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer, 
    orders: orderReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;