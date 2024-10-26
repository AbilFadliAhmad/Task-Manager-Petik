import React, { useState } from 'react';
import { MdOutlineSearch } from 'react-icons/md';
import { setOpenSidebar } from '../redux/slices/authSlice';
import { UserAvatar, NotificationPanel } from '.';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const [input, setInput]  = useState(localStorage.getItem('search') || '')
  const { theme } = useSelector((state) => state.auth);
  const dispatch = useDispatch()
  const location = useLocation().pathname.split('/')[1]
  const conditionSearch = location == 'tasks' || location == 'completed' || location == 'in-progress' || location == 'todo' ? true : false 

  const handleCLick = async() => {
    await localStorage.setItem('search', input)
    const params = new URLSearchParams(window.location.search);
        if(params.has('halaman')){
            params.set('halaman', 1)
        } else {
            params.append('halaman', 1)
        }
        window.location.search = params.toString();
  }

  const handleKeyDown = (e) => {
    if(e.key =='Enter') {
      handleCLick()
    }
  }

  return (
    <div className={`flex seamlessly justify-between items-center ${theme.darkMode ? 'bg-gray-800 border-b border-white text-white' : 'bg-gray-200'}  px-7 py-3 2xl:py-4 sticky z-10 top-0 shadow-md`}>
      <div className="flex gap-4">
        <button onClick={() => dispatch(setOpenSidebar(true))} className="text-2xl text-gray-500 block md:hidden">
          ☰
        </button>
        {conditionSearch ? (
        <div className="relative w-full">
          <MdOutlineSearch onClick={handleCLick} className={`${theme.darkMode ? 'text-black' : 'text-gray-400'} text-2xl sm:inline hover:cursor-pointer absolute left-3 top-1.5 `} />
          <input autoFocus onKeyDown={handleKeyDown} value={input} onChange={(e)=>setInput(e.target.value)} type="text" placeholder="Search..." className={`sm:w-[140%] w-[10rem] py-1.5 pl-10 pr-5 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black }`} />
        </div>
        ) : (
          <div></div>
        )}
        
      </div>

      <div className="flex gap-2 items-center">
        <NotificationPanel />
        <UserAvatar />
      </div>
    </div>
  );
};

export default Navbar;
