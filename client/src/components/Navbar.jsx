import React from 'react';
import { MdOutlineSearch } from 'react-icons/md';
import { setOpenSidebar, setSeacrhList } from '../redux/slices/authSlice';
import { UserAvatar, NotificationPanel } from '.';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const [input, setInput]  = React.useState(localStorage.getItem('search') || '')
  const dispatch = useDispatch()
  const location = useLocation().pathname.split('/')[1]
  const conditionSearch = location == 'tasks' || location == 'completed' || location == 'in-progress' || location == 'todo' ? true : false 

  const handleCLick = async() => {
    await localStorage.setItem('search', input)
    window.location.reload()
  }

  const handleKeyDown = (e) => {
    if(e.key =='Enter') {
      handleCLick()
    }
  }

  return (
    <div className="flex justify-between items-center bg-gray-200 px-7 py-3 2xl:py-4 sticky z-10 top-0 shadow-md">
      <div className="flex gap-4">
        <button onClick={() => dispatch(setOpenSidebar(true))} className="text-2xl text-gray-500 block md:hidden">
          ☰
        </button>
        {conditionSearch ? (
        <div className="relative w-full">
          <MdOutlineSearch onClick={handleCLick} className="text-gray-400 text-2xl sm:inline hover:cursor-pointer absolute left-3 top-1.5 " />
          <input autoFocus onKeyDown={handleKeyDown} value={input} onChange={(e)=>setInput(e.target.value)} type="text" placeholder="Search..." className="sm:w-[140%] w-[10rem] py-1.5 pl-10 pr-5 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
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
