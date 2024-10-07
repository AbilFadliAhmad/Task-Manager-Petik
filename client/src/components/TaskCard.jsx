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
  const [updateExpiredTask] = useUpdateExpiredMutation();
  const [updateTaskStage] = useUpdateStageTaskMutation();
  const { user, startCount } = useSelector((state) => state.auth);
  const [currentDate, setCurrentDate] = useState(Date.now());
  const [condition, setCondition] = useState(false);
  const [timer, setTimer] = useState(task?.timer ?? false);
  const [distance,setDistance] = useState(task?.deadline - currentDate)
  const [timeRemaining, setTimeRemaining] = useState({
    hours: distance > 0 ? Math.floor(distance / (1000 * 60 * 60)) : 0,
    minutes: distance > 0 ? Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)) : 0,
    seconds: distance > 0 ? Math.floor((distance % (1000 * 60)) / 1000) : 0,
  });
  const [count, setCount] = useState(true);
  const [open, setOpen] = useState(false);
  const [expired, setExpired] = useState(task?.isExpired);

  useEffect(() => {
    if (!count && !expired) {
      const updateExpired = async () => {
        try {
          const object = { id: task?._id, isExpired: true };
          await updateExpiredTask(object);
          setExpired(true);
        } catch (error) {
          console.log(error);
        }
      };
      updateExpired();
    } else if (count && expired && distance > 0) {
      const updateExpired = async () => {
        try {
          const object = { id: task?._id, isExpired: false };
          await updateExpiredTask(object);
          setExpired(false);
        } catch (error) {
          console.log(error);
        }
      };
      updateExpired();
    }
  }, [count]);

  useEffect(() => {
    if (startCount) {
      setDistance(task?.deadline - Date.now());
      setCondition(true);
    } else if (!startCount) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [startCount]);
  
  useEffect(() => {
    if(condition == true) {
      setTimeRemaining({
        hours: distance > 0 ? Math.floor(distance / (1000 * 60 * 60)) : 0,
        minutes: distance > 0 ? Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)) : 0,
        seconds: distance > 0 ? Math.floor((distance % (1000 * 60)) / 1000) : 0,
      });
      startCountdown(distance);
      setCondition(false);
    }
  }, [condition]  );

  useEffect(() => {
    console.log(task?.stage == 'completed' && task?.isExpired == false && task?.timer == false, 'kira kira berhasil atau tidak')
    if(task?.stage == 'completed' && task?.isExpired == false && task?.timer == true) {
      const updateTask = async()=>{
        try {
          console.log('lah trus ini kapan')
          await updateTaskStage({ id: task?._id, batas: '78893280' });
          setTimer(false);
          clearInterval(intervalRef.current);
        } catch (error) {
          console.log(error)
          toast.error(error?.data?.message || error.message)
        } 
      }
      updateTask();
    }
  }, [task?.stage])

  const startCountdown = (distance) => {
    intervalRef.current = setInterval(() => {
      // const hours = Math.floor(distance / (1000 * 60 * 60));
      // const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      // const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        clearInterval(intervalRef.current);
        setCount(false);
        setTimeRemaining({ minutes: 0, seconds: 0, hours: 0 });
      } else {
        setTimeRemaining((prevTime) => {
          if (prevTime.hours === 0 && prevTime.minutes === 0 && prevTime.seconds === 0) {
            setCount(false);
            clearInterval(intervalRef.current);
            return prevTime;
          }

          let { hours, minutes, seconds } = prevTime;

          if (seconds > 0) {
            seconds -= 1;
          } else {
            seconds = 59;
            if (minutes > 0) {
              minutes -= 1;
            } else {
              minutes = 59;
              hours -= 1;
            }
          }

          return { hours, minutes, seconds };
        });
      }
    }, 1000);
  };
  return (
    <>
      <div className={`w-full h-fit bg-gray-100 shadow-md p-4 rounded relative ${expired ? 'opacity-50' : ''} ${user.isAdmin || !expired ? '' : 'cursor-not-allowed'}`}>
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
          <div className="w-full pb-2 text-xl">
            <span>{timeRemaining.hours.toString().padStart(2, '0')}</span>
            <span>:</span>
            <span>{timeRemaining.minutes.toString().padStart(2, '0')}</span>
            <span>:</span>
            <span>{timeRemaining.seconds.toString().padStart(2, '0')}</span>
          </div>
        ) : (
          <div className="w-full pb-2 text-xl">
            <p className='invisible'>No Timer</p>
          </div>
        )}
      </div>
      <AddSubTask open={open} setOpen={setOpen} id={task._id} />
    </>
  );
};

export default TaskCard;
