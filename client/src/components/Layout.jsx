import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar, Navbar, MobileSidebar } from '.';
import MobileSidebar2 from './MobileSidebar2';
import { setChangeLocation } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';

const Layout = () => {
  const { user, location } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const path = useLocation().pathname.split('/')[1];
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (path !== 'dashboard') {
      dispatch(setChangeLocation(true));
    } else {
      dispatch(setChangeLocation(false));
    }
  }, [path]);

  return user ? (
    <div className={`w-full h-screen flex flex-col md:flex-row`}>
      <div className="w-1/5 h-screen bg-white sticky top-0 hidden md:block">{<Sidebar />}</div>

      {<MobileSidebar />}
      {/* <Sidebar /> */}
      <div className={`flex-1 overflow-y-auto bg-gray-200`}>
        <Navbar />
        <div className="p-4 2xl:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/log-in" state={{ from: location }} replace />
  );
};

export default Layout;
