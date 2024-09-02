import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { apiSlice } from './slices/apiSlice';

// Contoh Middleware
// const loggerMiddleware = (storeAPI) => (next) => (action) => {
//     console.log('Dispatching action:', action); // Mencatat aksi yang dikirim
//     let result = next(action); // Meneruskan aksi ke middleware berikutnya atau ke reducer
//     console.log('Next state:', storeAPI.getState()); // Mencatat state setelah aksi diproses
//     return result; // Mengembalikan hasil dari next(action)
//   };

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools:true
});
