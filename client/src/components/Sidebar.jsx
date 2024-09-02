import React from 'react'
import { MdDashboard, MdOutlinePendingActions, MdTaskAlt, MdOutlineHistory, MdOutlineAddTask, MdSettingsInputAntenna, MdSettings } from 'react-icons/md';
import { FaTasks, FaTrashAlt, FaUsers } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { setOpenSidebar, setSeacrhList } from '../redux/slices/authSlice';
import clsx from 'clsx';

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
      label: "Activity Log",
      link: "activity",
      icon: <MdOutlineHistory />,
    },
  ];

const Sidebar = () => {
    const {user} = useSelector(state=>state.auth)
    const dispatch = useDispatch()
    const location = useLocation()
    const path = location.pathname.split('/')[1]
    const sidebarLinks = user?.isAdmin ? linkData : user?.isUstadz ? linkData.slice(0, 6) : linkData.slice(0, 5)
    
    const closeSidebar = ()=> {
        dispatch(setOpenSidebar(false))
        localStorage.setItem('search', '')
        localStorage.setItem('searchLogs', '')
        localStorage.setItem('halaman', '1')
    }

    const NavLink = ({el}) => {
      return (
        <Link
          to={el.link}
          onClick={closeSidebar}
          className={clsx('w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center text-gray-800 text-base hover:bg-[#8394a4]', path === el.link.split("/")[0] ? 'bg-blue-600 text-neutral-100' : '')}
        >
          {el.icon}
          <span className='hover:text-[#286c98]'>{el.label}</span>
        </Link>
      )
    }
    
  return (
    <div className='w-full h-screen flex flex-col gap-5 p-5 bg-gray-300'>
      <div className='flex gap-1 items-center'>
        <p className='bg-blue-600 p-2 rounded-full'>
          <MdOutlineAddTask className='text-white text-2xl font-black' />
        </p>
        <span className='text-2xl font-bold text-black'>Task Manager</span>
      </div>

      <div className='flex-1 flex flex-col gap-y-5 py-8'>
        {sidebarLinks.map( item => (
          <NavLink el={item} key={item.label} />
        ))}
      </div>

      <div>
        <button className='w-full flex gap-2 p-2 items-center text-lg text-gray-800'>
          <MdSettings />
          <span>Settings</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar