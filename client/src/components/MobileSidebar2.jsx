import React, { Fragment, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenSidebar } from '../redux/slices/authSlice';
import { Transition } from '@headlessui/react';
import { IoClose } from 'react-icons/io5';
import Sidebar from './Sidebar';
import clsx from 'clsx';

const MobileSidebar2 = () => {
  const { isSidebarOpen } = useSelector((state) => state.auth);
  const mobileMenuRef = useRef(null);
  const dispatch = useDispatch();

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  // Example usage of the ref
  useEffect(() => {
    if (mobileMenuRef.current) {
      console.log('mobilan', mobileMenuRef.current); // Access the DOM element
    }
  }, [isSidebarOpen]);
  return (
    <div onClick={() => closeSidebar()}>
      <Transition
        as={Fragment}
        show={isSidebarOpen}
        enter="transition ease-in duration-100"
        enterFrom="transform -translate-x-200 opacity-0"
        enterTo="transform translate-x-0 opacity-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform translate-x-0 opacity-100"
        leaveTo="transform -translate-x-full opacity-0"
      >
        <div
          ref={(node) => (mobileMenuRef.current = node)}
          className={clsx('md:hidden w-3/4 border border-gray-500 h-screen bg-black/40 transition-all duration-700 transform ', isSidebarOpen ? '-translate-x-0' : '-translate-x-200')}
          onClick={() => closeSidebar()}
        >
          <Sidebar />
        </div>
      </Transition>
    </div>
  );
};

export default MobileSidebar2;
