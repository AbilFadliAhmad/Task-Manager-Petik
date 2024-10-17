import React from 'react'
import {
  MdAdminPanelSettings,
} from 'react-icons/md'
import { LuClipboardEdit } from "react-icons/lu";
import { FaNewspaper, FaUsers } from 'react-icons/fa'
import { FaArrowsToDot } from 'react-icons/fa6'
import { MdTimerOff } from "react-icons/md";
import { IoTimer } from "react-icons/io5";
import moment from 'moment'
import clsx from 'clsx'
// import { summary } from '../assets/data';
import {Card, Chart, Loading2, TaskTable, UserTable} from '../components';
import { useGetDashboardQuery } from '../redux/slices/DashboardApiSlice';
import { BiSolidTimer } from "react-icons/bi";
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';


const Dashboard = () => {
  const {data, isLoading} = useGetDashboardQuery()
  const [summary, setSummary] = React.useState([])
  const {theme} = useSelector(state => state.auth) 

  React.useEffect(() => {
    if(data && !isLoading) {
      data && setSummary(data)
    } 
  }, [data,isLoading])

  const stats = [
    {
      _id: "1",
      label: "TOTAL TASK",
      total: summary?.totalTasks || 0,
      icon: <FaNewspaper />,
      bg: "bg-red-600",
    },
    {
      _id: "2",
      label: "COMPLETED TASK",
      total: summary?.tasks?.completed ?? 0,
      icon: <MdAdminPanelSettings className='text-xl' />,
      bg: "bg-green-600",
    },
    {
      _id: "3",
      label: "TASK IN PROGRESS ",
      total: summary?.tasks ? summary?.tasks["in progress"] ?? 0 :  0,
      icon: <LuClipboardEdit />,
      bg: "bg-[#f59e0b]",
    },
    {
      _id: "4",
      label: "TODOS",
      total: summary?.tasks?.todo ??  0,
      icon: <FaArrowsToDot />,
      bg: "bg-blue-600",
    },
    {
      _id: "5",
      label: "TIMER",
      total: summary?.timerTasks?.length ?? 0,
      icon: <IoTimer className='text-xl' />,
      bg: "bg-purple-800",
    },
    {
      _id: "5",
      label: "EXPIRED",
      total: summary?.expiredTasks?.length ?? 0,
      icon: <MdTimerOff className='text-lg' />,
      bg: "bg-red-900",
    },
  ];

  return isLoading ? <Loading2 /> : (
    <div className='h-full p-4'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
        {
          stats?.map(({icon,bg, label, total}, index) =>(
            <Card key={index} icon={icon} bg={bg} label={label} count={total} />
          ))
        }
      </div>

      <div className={`w-full ${theme.darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'} my-16 p-4 rounded shadow:lg`}>
        <h4>Chart berdasarkan Prioritas</h4>
        <Chart graphData={summary?.graphData} />
      </div>

      <div className='w-full flex flex-col lg:flex-row gap-4 2xl:gap-10 py-8'>
          {/* left */}
          <TaskTable tasks={summary?.last10Task} />

          {/* Right */}
          <UserTable users={summary?.users} />
      </div>
    </div>
  )
}

export default Dashboard