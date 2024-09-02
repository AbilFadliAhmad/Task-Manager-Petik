import React, { useState } from 'react';
import { MdAttachFile, MdKeyboardArrowDown, MdKeyboardArrowUp, MdKeyboardDoubleArrowUp } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { BGS, formatDate, getInitials, PRIOTITYSTYELS, TASK_TYPE } from '../utils';
import { AddSubTask, TaskDialog, UserInfo } from '.';
import { BiMessageDetail } from 'react-icons/bi';
import { FaList } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  normal: <MdKeyboardArrowDown />,
};

const TaskCard = ({ task }) => {
  const { user } = useSelector((state) => state.auth);
  const [open,setOpen] = useState(false)
  return (
    <>
      <div className="w-full h-fit bg-gray-100 shadow-md p-4 rounded">
        <div className="flex justify-between w-full">
          <div className={`flex flex-1 gap-1 items-center text-sm font-medium ${PRIOTITYSTYELS[task?.priority]}`}>
            <span className="text-lg">{ICONS[task?.priority]}</span>
            <span className="uppercase">{task?.priority} Priority</span>
          </div>
          <TaskDialog task={task} />
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full pr-4 ${TASK_TYPE[task?.stage]}`}></div>
          <h4 className="line-clamp-1 text-black">{task?.title}</h4>
        </div>
        <span className="text-sm text-gray-600">{formatDate(new Date(task?.date))}</span>
        <div className="w-full border border-gray-300 my-2" />
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="flex gap-2 items-center text-sm text-gray-600">
              <BiMessageDetail />
              <span>{task?.activities?.length}</span>
            </div>
            <div className="flex gap-2 items-center text-sm text-gray-600">
              <MdAttachFile />
              <span>{task?.assets?.length}</span>
            </div>
          </div>

          <div className="flex flex-row-reverse gap-2 pr-4 sm:pr-0">
            {task?.team.length > 0 ? task?.team?.map((m, index) => {
              return m.image.length < 1 ? (
              <div key={index} className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1 ${BGS[index % BGS.length]}`}>
                <UserInfo user={m} color={index} />
              </div>
            ) : <div key={index} className='w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1 lg:block md:hidden sm:block'><UserInfo user={m} color={index} /><img src={m.image} className='w-full h-full rounded-full border border-gray-400 shadow-md' /></div>}): null}
          </div>
        </div>
        {/* Sub Tasks */}
        {task?.leader.length > 0 
        ? (
          <div className='py-4 border-t border-gray-300 flex gap-1'>
            {/* <h5 className='line-clamp-1 text-base text-black'>{task?.subTasks[0].title}</h5> */}
            {task?.leader.map((item,index)=>{ 
              return item.image.length > 1 ? (<div key={index}><UserInfo right={'isi'} user={item} color={index} /><img key={index} src={item.image} className='w-7 h-7 rounded-full border-2 border-gray-300 shadow-md shadow-gray-400'/></div>)
              :(<div key={index} className='w-7 h-7 rounded-full text-white flex items-center justify-center bg-purple-600'><UserInfo right={'isi'} user={item} color={index} /><span className='text-sm absolute invisible'>{getInitials(item?.name)}</span></div>)
            })}
          </div>
        )
        : (
          <div className='py-4 border-t border-gray-300 '>
            <span className=' text-gray-500'>Tidak ada leader</span>
          </div>
        )
        }
        <div className='w-full pb-2 invisible'>
          <button onClick={()=>setOpen(true)} disabled={user.isAdmin ? false : true} className='w-full flex gap-4 items-center text-sm text-gray-500 font-semibold disabled:cursor-not-allowed disabled:text-gray-300'>
            <IoMdAdd className='text-lg' />
            <span className=''>ADD SUBTASK</span>
          </button>
        </div>
      </div>
      <AddSubTask open={open} setOpen={setOpen} id={task._id} />
    </>
  );
};

export default TaskCard;
