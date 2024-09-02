import React, { Fragment } from 'react';
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import { BGS, Border, getInitials } from '../utils';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const UserInfo = ({ user, color,right, khusus }) => {
  const { location } = useSelector((state) => state.auth);
  const path = useLocation()?.pathname.split("/")[1]

  return (
    <div className="px-4 relative">
      <Popover className={`${user?.image?.length > 1 ? `absolute left-0 ${path=='dashboard' ? '-bottom-4' : ''}` : 'relative'}`}>
        {/* {({open})=>( */}
        <PopoverButton className={`group text-[0.7rem] inline-flex items-center outline-none`}>
          {user?.image?.length > 1 
          ? <div className='w-7 h-7 rounded-full bg-black opacity-0'></div> 
          :<span className={`${user?.image?.length > 1 ? 'text-black text-2xl opacity-0' : ''}`}>{getInitials(user?.name)}</span>}
        </PopoverButton>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <PopoverPanel className={`left-1/2 ${right ? 'left-[13rem]' : ''} mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl ${!khusus ? 'absolute' : 'fixed top-0 left-0'} fixed top-0 left-0 z-[1000]`}>
            <div className={`flex items-center gap-4 rounded-lg shadow-lg bg-white p-4 ${color !== undefined ? Border[color % Border.length] : 'border-violet-700'} border-t-[8px] ${location ? 'absolute left-[10rem]' : khusus ? '' : 'absolute w-[100%] bottom-0'}`}>
              <div className={`w-16 h-16 ${color !== undefined ? BGS[color % BGS.length] : 'bg-violet-700'} rounded-full text-white flex items-center justify-center text-2xl`}>
                {user?.image?.length > 1 ? <img src={user?.image} alt={user?.name} className="w-full h-full object-cover rounded-full border border-gray-400 shadow-lg" /> : <span>{getInitials(user?.name)}</span>}
                
              </div>
              <div className="flex flex-col gap-y-1">
                <p className="text-black text-xl font-bold">{user?.name}</p>
                <span className="text-base text-gray-500 font-semibold">{user?.title}</span>
                <span className="text-base text-blue-500 font-semibold">{user?.email}</span>
              </div>
            </div>
          </PopoverPanel>
        </Transition>
        {/* )} */}
      </Popover>
    </div>
  );
};

export default UserInfo;
