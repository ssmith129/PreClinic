import { configureStore } from '@reduxjs/toolkit';
import sidebarSlice from './sidebarSlice';
import themeReducer from './themeSlice';




const store = configureStore({
  reducer: {
    sidebarSlice: sidebarSlice,
    theme: themeReducer,
  },
});


export default store;





