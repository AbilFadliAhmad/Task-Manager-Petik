import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
  isSidebarOpen: true,
  location: false,
  search:localStorage.getItem('search') || '',
  startCount: true
};

const authSlice = createSlice ({
    name:'auth',
    initialState,
    reducers : {
        setCredentials : (state, action)=>{
            state.user = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        },
        logout: (state, action)=>{
            state.user = null;
            localStorage.removeItem('userInfo');
        },
        setOpenSidebar: (state, action)=>{
            state.isSidebarOpen = action.payload
        },
        setChangeLocation: (state, action)=>{
            state.location = action.payload
        }, 
        setSeacrhList: (state, action)=>{
            state.search = action.payload
        }, 
        setStartCount: (state, action)=>{
            state.startCount = action.payload
        }
    }
})

export const { setCredentials, logout, setOpenSidebar, setChangeLocation, setSeacrhList, setStartCount } = authSlice.actions;
export default authSlice.reducer