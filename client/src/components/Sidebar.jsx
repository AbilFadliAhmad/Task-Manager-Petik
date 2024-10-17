import React from 'react';
import { MdDashboard, MdOutlinePendingActions, MdTaskAlt, MdOutlineHistory, MdOutlineAddTask, MdSettingsInputAntenna, MdSettings } from 'react-icons/md';
import { FaTasks, FaTrashAlt, FaUsers } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { setChangeTheme, setOpenSidebar } from '../redux/slices/authSlice';
import clsx from 'clsx';
import { ShowMenu } from '.';
import { MdWbSunny } from "react-icons/md";
import { IoMoonSharp } from "react-icons/io5";
import { Menu } from '@headlessui/react';

const linkData = [
  {
    label: 'Dashboard',
    link: 'dashboard',
    icon: <MdDashboard />,
  },
  {
    label: 'Tasks',
    link: 'tasks',
    icon: <FaTasks />,
  },
  {
    label: 'Completed',
    link: 'completed/completed',
    icon: <MdTaskAlt />,
  },
  {
    label: 'In Progress',
    link: 'in-progress/in progress',
    icon: <MdOutlinePendingActions />,
  },
  {
    label: 'To Do',
    link: 'todo/todo',
    icon: <MdOutlinePendingActions />,
  },
  {
    label: 'Team',
    link: 'team',
    icon: <FaUsers />,
  },
  {
    label: 'Trash',
    link: 'trashed',
    icon: <FaTrashAlt />,
  },
  {
    label: 'Activity Log',
    link: 'activity',
    icon: <MdOutlineHistory />,
  },
];

const Sidebar = () => {
  const { user, theme } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const path = location.pathname.split('/')[1];
  const sidebarLinks = user?.isAdmin ? linkData : user?.isUstadz ? linkData.slice(0, 6) : linkData.slice(0, 5);
  
  const items = [
    {
      label: "Light Mode",
      icon: <MdWbSunny className='mr-2 h-5 w-5 text-orange-400' aria-hidden='true' />,
      onClick: () => {dispatch(setChangeTheme({darkMode: false, lightMode: true})); localStorage.setItem('theme', JSON.stringify({darkMode: false, lightMode: true}))},
    },
    {
      label: "Dark Mode",
      icon: <IoMoonSharp className='mr-2 h-5 w-5 text-yellow-400' aria-hidden='true' />,
      onClick: () => {dispatch(setChangeTheme({darkMode: true, lightMode: false})); localStorage.setItem('theme', JSON.stringify({darkMode: true, lightMode: false}))},
    },
  ]
  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
    localStorage.setItem('search', '');
    localStorage.setItem('searchLogs', '');
    localStorage.setItem('halaman', '1');
  };

  const stillOpen = () => {
    dispatch(setOpenSidebar(true));
  }

  const NavLink = ({ el }) => {
    return (
      <Link
        to={el.link}
        onClick={closeSidebar}
        className={clsx('w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center text-gray-800 text-base', path === el.link.split('/')[0] ? 'bg-blue-600 text-neutral-100' : '', theme.darkMode ? 'text-white hover:bg-blue-950' : 'text-black hover:bg-[#8394a4]')}
      >
        {el.icon}
        <span className={`${theme.darkMode ? '' : 'hover:text-[#286c98]'}`}>{el.label}</span>
      </Link>
    );
  };

  return (
    <div className={`w-full h-screen flex flex-col seamlessly gap-5 p-5 ${theme.darkMode ? 'bg-gray-900 border-r border-white' : 'bg-gray-300'}`}>
      <div className="flex gap-1 items-center">
        <p className="bg-blue-600 p-2 rounded-full">
          <MdOutlineAddTask className="text-white text-2xl font-black" />
        </p>
        <span className={`text-2xl font-bold ml-3 ${theme.darkMode ? 'text-white' : 'text-black'}`}>Task Manager</span>
      </div>

      <div className={`flex-1 flex flex-col gap-y-5 py-8 ${theme.darkMode ? 'text-white' : 'text-black'}`}>
        {sidebarLinks.map((item) => (
          <NavLink el={item} key={item.label} />
        ))}
      </div>

      <div>
        <ShowMenu
          icon={
            <button className={`w-full flex gap-2 p-2 items-center text-lg ${theme.darkMode ? 'text-white hover:text-blue-700' : 'text-gray-800 hover:text-blue-700'}`}>
              <MdSettings />
              <span>Settings</span>
            </button>
          }
          custom={'flex flex-col text-lg text-gray-800 '}
        >
          {items.map((el) => (
            <div key={el.label} className='px-1 py-1 space-y-2 '>
              <Menu.Item key={el.label}>
                {({ active }) => (
                  <button
                    onClick={el?.onClick}
                    className={`${
                      active ? "bg-blue-500 text-neutral-100" : "text-white"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {el.icon}
                    {el.label}
                  </button>
                )}
              </Menu.Item>
          </div>
          ))}
        </ShowMenu>
      </div>
    </div>
  );
};

export default Sidebar;
