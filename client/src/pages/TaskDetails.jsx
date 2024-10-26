import clsx from 'clsx';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { FaBug, FaTasks, FaThumbsUp, FaUser } from 'react-icons/fa';
import { GrInProgress } from 'react-icons/gr';
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdKeyboardDoubleArrowUp, MdOutlineDoneAll, MdOutlineMessage, MdTaskAlt } from 'react-icons/md';
import { RxActivityLog } from 'react-icons/rx';
import { useNavigate, useParams } from 'react-router-dom';
import {  Button, Activities, Loading2 } from '../components';
import Tabs from '../components/Tabs';
import { PRIOTITYSTYELS, TASK_TYPE, getInitials } from '../utils';
import { tasks } from '../assets/data';
import { useGetTaskQuery } from '../redux/slices/TaskApiSlice';
import { useSelector } from 'react-redux';
import { FiRefreshCcw } from 'react-icons/fi';
import toast from 'react-hot-toast';
// import { useGetSingleTaskQuery, usePostTaskActivityMutation } from '../redux/slices/api/taskApiSlice';

const assets = [
  'https://images.pexels.com/photos/2418664/pexels-photo-2418664.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/8797307/pexels-photo-8797307.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/2534523/pexels-photo-2534523.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/804049/pexels-photo-804049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
];

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  normal: <MdKeyboardArrowDown />,
};

const bgColor = {
  high: 'bg-red-200',
  medium: 'bg-yellow-200',
  normal: 'bg-green-200',
};

const TABS = [
  { title: 'Task Detail', icon: <FaTasks /> },
  { title: 'Activities/Timeline', icon: <RxActivityLog /> },
];

const TASKTYPEICON = {
  commented: (
    <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white">
      <MdOutlineMessage />,
    </div>
  ),
  started: (
    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white">
      <FaThumbsUp size={20} />
    </div>
  ),
  assigned: (
    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-500 text-white">
      <FaUser size={14} />
    </div>
  ),
  bug: (
    <div className="text-red-600">
      <FaBug size={24} />
    </div>
  ),
  completed: (
    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white">
      <MdOutlineDoneAll size={24} />
    </div>
  ),
  'in progress': (
    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-600 text-white">
      <GrInProgress size={16} />
    </div>
  ),
};

const act_types = ['Started', 'Completed', 'In Progress', 'Commented', 'Bug', 'Assigned'];
const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate()
  const {data, isLoading, refetch: refetchitem} = useGetTaskQuery({id});
  const {theme, user} = useSelector(state => state.auth)
  const [expired, setExpired] = useState(false)
  console.log(data?.task.isExpired,'expired');
  
  const [selected, setSelected] = useState(parseInt(localStorage.getItem('selected')) || 0);
  let task = data?.task ?? [];

  useEffect(() => {
    if (data?.task?.isExpired && !user.isAdmin) {
      navigate('/tasks')
      toast.error('Tugas sudah kadaluarsa')
    } else if (data?.task.isExpired) {
      setExpired(true)
    }
  });

  return !isLoading ? (
    <div className="w-full flex flex-col gap-3 mb-4 overflow-y-hidden p-4">
      <div className='flex justify-between'>
        <h1 className={`text-2xl ${theme?.darkMode ? 'text-white' : 'text-gray-600'} font-bold`}>{task?.title}</h1>
        <Button onClick={()=>refetchitem()} icon={<FiRefreshCcw className="text-lg" />} label={'Refresh'} className={`flex text-white flex-row-reverse gap-3 items-center bg-blue-700 py-2 2xl:py-2.5`} />
      </div>

      <Tabs setSelected={setSelected} tabs={TABS}>
        {selected == 0 ? (
          <>
            <div className={`w-full seamlessly flex flex-col md:flex-row gap-5 2xl:gap-8 ${theme.darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'} shadow-md p-8 overflow-y-auto`}>
              <div className="w-full md:w-1/2 space-y-8">
                <div className="flex items-center gap-5">
                  <div className={clsx('flex gap-1 items-center text-base font-semibold px-3 py-1 rounded-full', PRIOTITYSTYELS[task?.priority], bgColor[task?.priority])}>
                    <span className="text-lg">{ICONS[task?.priority]}</span>
                    <span className="uppercase">{task?.priority} Priority</span>
                  </div>

                  <div className={clsx('flex items-center gap-2')}>
                    <div className={clsx('w-4 h-4 rounded-full', TASK_TYPE[task?.stage])} />
                    <span className=" uppercase">{task?.stage}</span>
                  </div>
                </div>

                <p className="text-gray-500">Created At: {new Date(task?.date).toDateString()}</p>

                <div className={`flex items-center gap-8 p-4 border-y ${theme?.darkMode ? '' : 'border-gray-500'}`}>
                  <div className="space-x-2">
                    <span className="font-semibold">Assets :</span>
                    <span>{task?.assets?.length}</span>
                  </div>

                  <span className="text-gray-400">|</span>

                  <div className="space-x-2">
                    <span className="font-semibold">Leader :</span>
                    <span>{task?.leader?.length}</span>
                  </div>
                </div>
                <div className='w-11 h-11 rounded-full  flex gap-2'>
                  {task?.leader?.map((item, index)=>(<img key={index} src={item?.image} className='w-full h-full rounded-full object-cover border-[1px] border-black shadow-md' />))}
                </div>

                <div className="space-y-4 ">
                  <p className={`text-gray-600 ${theme?.darkMode ? 'text-neutral-300' : 'text-gray-600'} font-semibold test-sm`}>TASK TEAM</p>
                  <div className="space-y-3">
                    {task?.team?.map((m, index) => (
                      <div key={index} className="flex gap-4 py-2 items-center border-t border-gray-200">
                        <div className={'w-10 h-10 rounded-full text-white flex items-center justify-center text-sm -mr-1 bg-green-600'}>
                          {/* <span className="text-center">{getInitials(m?.name)}</span> */}
                          <img className="w-full h-full rounded-full object-cover" src={m?.image} />
                        </div>

                        <div>
                          <p className="text-lg font-semibold">{m?.name}</p>
                          <span className="text-gray-500">{m?.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 py-6">
                </div>

              </div>
              <div className="w-full md:w-1/2 space-y-8">
                <p className="text-lg font-semibold">ASSETS</p>

                <div className="w-full grid grid-cols-2 gap-4">
                    <img src={task?.assets ?? ''} alt={task?.title} className="w-full rounded h-28 md:h-36 2xl:h-52 cursor-pointer transition-all duration-500 hover:scale-125 hover:z-50" />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div><Activities navigate={navigate} activity={task?.activities} stage={task?.stage} id={id} /></div>
        )}
      </Tabs>
    </div>
  ) : <Loading2 />;
};

export default TaskDetails;
