import React, { Fragment, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenSidebar } from '../redux/slices/authSlice';
import { Transition } from '@headlessui/react';
import { IoClose } from 'react-icons/io5';
import Sidebar from './Sidebar';
import clsx from 'clsx';

const MobileSidebar = () => {
  const { isSidebarOpen } = useSelector((state) => state.auth);
  const mobileMenuRef = useRef(null);
  const dispatch = useDispatch();

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  // Example usage of the ref
  // React.useEffect(() => {
  //   if (mobileMenuRef.current) {
  //     console.log('mobilan', mobileMenuRef.current); // Access the DOM element
  //   }
  // }, [isSidebarOpen]);
  return (
    <div>
      <Transition
        as={Fragment}
        show={isSidebarOpen}
        enter="transition ease-out duration-100"
        enterFrom="transform -translate-x-full opacity-0"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        {(ref) => (
          <div
            ref={(node) => (mobileMenuRef.current = node)}
            className={clsx('md:hidden w-full h-screen bg-black/40 transition-all duration-700 transform ', isSidebarOpen ? '-translate-x-0' : 'translate-x-full')}
            onClick={() => closeSidebar()}
          >
            <div className="bg-white w-3/4 h-full">
              <div className="w-full flex justify-end px-5 mb-4">
                <button onClick={() => closeSidebar()} className="flex justify-end items-end">
                  <IoClose size={25} className="" />
                </button>
              </div>

              <div className="-mt-10">
                <Sidebar />
              </div>
            </div>
          </div>
        )}
      </Transition>
    </div>
  );
};

export default MobileSidebar;
