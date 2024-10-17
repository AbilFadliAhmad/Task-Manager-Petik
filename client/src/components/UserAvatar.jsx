import { Menu, MenuItems, MenuItem, MenuButton } from '@headlessui/react';
import { useState } from 'react';
import { FaUser, FaUserLock } from 'react-icons/fa';
import { IoLogOutOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import { getInitials } from '../utils';
import { useLogoutMutation } from '../redux/slices/authApiSlice';
import { Password, Profile } from '.';
import { HiSpeakerphone } from 'react-icons/hi';
import toast from 'react-hot-toast';

const UserAvatar = () => {
  const [open, setOpen] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const { user, theme } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutUser] = useLogoutMutation();

  const logoutHandler = async () => {
    const t = toast.loading('Logging out...');
    dispatch(logout());
    toast.dismiss(t);
    navigate('/log-in');
    toast.success('Berhasil Logout');
    await logoutUser();
    setTimeout(() => {
      window.location.reload();
    }, 2500);
  };

  return (
    <div>
      <Menu as={'div'} className="relative inline-block text-left">
        <div>
          <MenuButton className="w-10 h-10 2xl:w-12 2xl:h-12 items-center justify-center rounded-full bg-green-600 border border-gray-400">
            {user.image ? <img src={user.image} alt="" className="w-full h-full rounded-full" /> : <span className="text-white font-semibold">{getInitials(user?.name)}</span>}
          </MenuButton>

          <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right divide-gray-100 rounded-md bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none">
            <div className="p-4 ">
              <MenuItem>
                {({ active }) => (
                  <button onClick={() => setOpen(true)} className={`${active ? 'bg-gray-300' : ''} text-gray-700 group flex w-full items-center rounded-md px-2 py-2 text-base`}>
                    <FaUser className="mr-2" aria-hidden="true" />
                    Profile
                  </button>
                )}
              </MenuItem>

              <MenuItem className="text-black">
                {({ active }) => (
                  <button onClick={() => setOpenPassword(true)} className={`tetx-gray-700 ${active ? 'bg-gray-300' : ''} group flex w-full items-center rounded-md px-2 py-2 text-base`}>
                    <FaUserLock className="mr-2" aria-hidden="true" />
                    Change Password
                  </button>
                )}
              </MenuItem>
              {user.isAdmin && (
                <MenuItem>
                  {({ active }) => (
                    <Link to="/announcement" className={`text-black group flex w-full items-center ${active ? 'bg-gray-300' : ''} rounded-md px-2 py-2 text-base`}>
                      <HiSpeakerphone className="mr-2 " aria-hidden="true" />
                      Pengumuman
                    </Link>
                  )}
                </MenuItem>
              )}
              <MenuItem>
                {({ active }) => (
                  <button onClick={logoutHandler} className={`text-red-600 group ${active ? 'bg-gray-300' : ''} flex w-full items-center rounded-md px-2 py-2 text-base`}>
                    <IoLogOutOutline className="mr-2" aria-hidden="true" />
                    Logout
                  </button>
                )}
              </MenuItem>
            </div>
          </MenuItems>
        </div>
      </Menu>
      <Profile open={open} setOpen={setOpen} />
      <Password theme={theme} open={openPassword} setOpen={setOpenPassword} />
    </div>
  );
};

export default UserAvatar;
