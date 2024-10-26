import React, { useEffect, useRef, useState } from 'react';
import { MdAttachFile, MdKeyboardArrowDown, MdKeyboardArrowUp, MdKeyboardDoubleArrowUp } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { BGS, formatDate, getInitials, PRIOTITYSTYELS, TASK_TYPE } from '../utils';
import { AddSubTask, TaskDialog, UserInfo } from '.';
import { BiMessageDetail } from 'react-icons/bi';
import { useUpdateExpiredMutation } from '../redux/slices/TaskApiSlice';
import { useUpdateStageTaskMutation } from '../redux/slices/TaskApiSlice';
import toast from 'react-hot-toast';

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  normal: <MdKeyboardArrowDown />,
};

const TaskCard = ({ task }) => {
  const intervalRef = useRef(null);
  const blinkRef = useRef(null);
  const currentDate = new Date(Date.now()).toLocaleDateString('id-ID').split('/').join('-');
  const deadlineTime = task?.deadline ? task?.deadline.slice(0, 10) : task?.createdAt.slice(0, 10);
  const [year, month, date] = deadlineTime.split('-');
  const deadlineTimeReverse = `${date}-${month}-${year}`;
  const [updateExpiredTask] = useUpdateExpiredMutation();
  const [updateTaskStage] = useUpdateStageTaskMutation();
  const { user, startCount, theme } = useSelector((state) => state.auth);
  const [condition, setCondition] = useState(false);
  const [timer, setTimer] = useState(task?.timer ?? false);
  const [count, setCount] = useState(true);
  const [open, setOpen] = useState(false);
  const [expired, setExpired] = useState(task.isExpired || false);
  const [blinkText, setBlinkText] = useState(false);

  useEffect(() => {
    if (timer) {
      // if(count && !expired) toast.error('Task ini sudah melewati batas deadline')
      if (!count && !expired) {
        const updateExpired = async () => {
          try {
            setExpired(true);
            const object = { id: task?._id, isExpired: true, blink: false };
            await updateExpiredTask(object);
          } catch (error) {
            console.log(error);
          }
        };
        updateExpired();
      } 
    } else if(!timer && task.isExpired) {
      const updateExpired = async () => {
        try {
          setExpired(false);
          const object = { id: task?._id, isExpired: false };
          await updateExpiredTask(object);
        } catch (error) {
          console.log(error);
        }
      };
      updateExpired();
    } else if (!timer) {
      
    }
  }, [count]);

  useEffect(() => {
    if (startCount) {
      setCondition(true);
    } else if (!startCount) {
      clearInterval(blinkRef.current);
      clearInterval(intervalRef.current);
    }
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(blinkRef.current);
    };
  }, [startCount]);

  useEffect(() => {
    if (condition == true) {
      startCountdown();
      handleBlinkText();
      setCondition(false);
    }
  }, [condition]);

  useEffect(() => {
    if (task?.stage == 'completed' && !task?.isExpired && task?.timer) {
      const updateTask = async () => {
        try {
          await setTimer(false);
          await updateTaskStage({ id: task?._id, batas: '78893280' });
          clearInterval(intervalRef.current);
        } catch (error) {
          console.log(error);
          toast.error(error?.data?.message || error.message);
        }
      };
      updateTask();
    }
  }, []);

  const startCountdown = () => {
    const [startDeadline, midleDeadline, endDeadline] = deadlineTimeReverse.split('-');
    const [startDate, middleDate, endDate] = currentDate.split('-');
    intervalRef.current = setInterval(() => {
      if (endDeadline >= endDate) {
        if (midleDeadline >= middleDate) {
          if (startDeadline >= startDate) {
            setCount('string');
            return;
          }
        }
      }
      setCount(false);
      clearInterval(intervalRef.current);
      return;
    }, 1000);
  };

  const handleBlinkText = async() => {
    if (currentDate == deadlineTimeReverse) {
      const object = { id: task?._id, blink:true };
      if(!task.blink) {
        await updateExpiredTask(object);
      }
      blinkRef.current = setInterval(() => {
        setBlinkText((prev) => !prev);
      }, 650);
    }
  };

  return task ? (
    <>
      <div className={`w-full seamlessly h-fit ${theme.darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'} shadow-md p-4 rounded relative ${expired ? 'opacity-50' : ''} ${user.isAdmin || !expired ? '' : 'cursor-not-allowed'}`}>
        {user?.isAdmin || !expired ? null : (
          <div className="w-[5rem] h-[5rem] rounded-full absolute -right-7 -top-5 bg-gray-800 items-center justify-center flex">
            <span className="text-red-300 font-bold">EXPIRED</span>
          </div>
        )}
        <div className="flex justify-between w-full">
          <div className={`flex flex-1 gap-1 items-center text-sm font-medium ${PRIOTITYSTYELS[task?.priority]}`}>
            <span className="text-lg">{ICONS[task?.priority]}</span>
            <span className="uppercase">{task?.priority} Priority</span>
          </div>
          {user.isAdmin || !expired ? <TaskDialog task={task} /> : null}
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full pr-4 ${TASK_TYPE[task?.stage]}`}></div>
          <h4 className={`line-clamp-1  ${expired ? 'line-through' : ''}`}>{task?.title}</h4>
        </div>
        <span className={`text-sm ${theme.darkMode ? 'text-neutral-200' : 'text-gray-600'}`}>{formatDate(new Date(task?.date))}</span>
        <div className="w-full border border-gray-300 my-2" />
        <div className="flex items-center justify-between mb-2">
          <div className={`flex items-center gap-3 ${theme.darkMode ? 'text-neutral-200' : 'text-gray-600'}`}>
            <div className={`flex gap-2 items-center text-sm ${theme.darkMode ? 'text-neutral-200' : 'text-gray-600'} `}>
              <BiMessageDetail />
              <span>{task?.activities?.length}</span>
            </div>
            <div className="flex gap-2 items-center text-sm">
              <MdAttachFile />
              <span>{task?.assets?.length}</span>
            </div>
          </div>

          <div className="flex flex-row-reverse gap-2 pr-4 sm:pr-0">
            {task?.team.length > 0
              ? task?.team?.map((m, index) => {
                  return m.image.length < 1 ? (
                    <div key={index} className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1 ${BGS[index % BGS.length]}`}>
                      <UserInfo user={m} color={index} />
                    </div>
                  ) : (
                    <div key={index} className="w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1 lg:block md:hidden sm:block">
                      <UserInfo user={m} color={index} />
                      <img src={m.image} className="w-full h-full rounded-full border border-gray-400 shadow-md" />
                    </div>
                  );
                })
              : null}
          </div>
        </div>
        {/* Sub Tasks */}
        {task?.leader?.length > 0 ? (
          <div className="py-4 border-t border-gray-300 flex gap-1">
            {/* <h5 className='line-clamp-1 text-base text-black'>{task?.subTasks[0].title}</h5> */}
            {task?.leader.map((item, index) => {
              return item.image.length > 1 ? (
                <div key={index}>
                  <UserInfo right={'isi'} user={item} color={index} />
                  <img key={index} src={item.image} className="w-7 h-7 rounded-full border-2 border-gray-300 shadow-md shadow-gray-400 object-cover" />
                </div>
              ) : (
                <div key={index} className="w-7 h-7 rounded-full text-white flex items-center justify-center bg-purple-600 ">
                  <UserInfo right={'isi'} user={item} color={index} />
                  <span className="text-sm absolute invisible">{getInitials(item?.name)}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-4 border-t border-gray-300 ">
            <span className=" text-gray-500">Tidak ada leader</span>
          </div>
        )}
        {timer ? (
          <div className={`w-full pb-2 text-xl ${expired ? 'line-through' : ''}`}>
            <span className="font-semibold text-red-800">Deadline: </span>
            <span className={`font-bold whitespace-pre ${blinkText ? 'text-red-700' : ''}`}>{task?.deadline.slice(0, 10)}</span>
          </div>
        ) : (
          <div className={`w-full opacity-0 pb-2 text-xl ${expired ? 'line-through' : ''}`}>
            <span className="font-semibold text-red-800">Deadline: </span>
            <span className={`font-bold ${blinkText ? 'text-red-700' : ''}`}>{task?.deadline.slice(0, 10)}</span>
          </div>
        )}
      </div>
      <AddSubTask open={open} setOpen={setOpen} id={task._id} />
    </>
  ) : null;
};

export default TaskCard;
