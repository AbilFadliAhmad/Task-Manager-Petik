import { MdAttachFile, MdKeyboardArrowDown, MdKeyboardArrowUp, MdKeyboardDoubleArrowUp } from 'react-icons/md';
import { BGS, formatDate, loadingDatab, PRIOTITYSTYELS, TASK_TYPE } from '../utils';
import { BiMessageDetail } from 'react-icons/bi';
import { FaList } from 'react-icons/fa';
import UserInfo from './UserInfo';
import Button from './Button';
import { AddTask, ConfirmationDialog } from '.';
import React, { useEffect, useRef, useState } from 'react';
import { useDeleteTaskMutation, useListTaskMutation, useUpdateExpiredMutation, useUpdateStageTaskMutation } from '../redux/slices/TaskApiSlice';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  normal: <MdKeyboardArrowDown />,
};

const TableRow = ({ task }) => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [selected, setSelected] = React.useState([]);
  const [deleteTask] = useDeleteTaskMutation();
  const [refetch] = useListTaskMutation();
  const intervalRef = useRef(null);
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
  const [expired, setExpired] = useState(task?.isExpired ?? false);

  const deleteClicks = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const deleteHandler = async () => {
    try {
      const object = {
        id: task._id,
        action: 'deleteTemporary',
      };
      const result = await deleteTask(object);
      if (result.data.success) {
        loadingDatab(refetch(object), `Berhasil Menghapus Tugas berjudul ${task?.title}`, `Gagal Menghapus Tugas berjudul ${task?.title}`)
          .then(() => setOpenDialog(false))
          .then(() => setTimeout(() => window.location.reload(), 1100));
      }
    } catch (error) {
      console.log(error);
      toast.error('Ada sesuatu yang salah saat menghapus task');
    }
  };

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
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
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
    }
  };

  return (
    <>
      <tr className={`border-b border-gray-200 ${theme?.darkMode ? 'text-neutral-300 hover:bg-gray-300/10' : 'text-gray-600 hover:bg-gray-300/60' }   ${expired ? 'line-through bg-red-300/50' : ''}`}>
        <td className="py-2 pr-8 sm:pr-0">
          <div className="flex items-center gap-2 lg:pr-0 pr-0 md:pr-4">
            <div className={`w-4 h-4 rounded-full pr-4 ${TASK_TYPE[task?.stage]}`}></div>
            <p className={`w-full line-clamp-2 text-base ${theme?.darkMode ? 'text-white' : 'text-black'} `}>{task?.title}</p>
          </div>
        </td>

        <td className="py-2">
          <div className="flex items-center w-[7.5rem]">
            <span className="text-sm ">{timer ? task?.deadline.slice(0, 10) : 'No Deadline'}</span>
          </div>
        </td>

        <td className="py-2">
          <div className="flex items-center gap-1 pr-8 md:pr-4 lg:pr-0">
            <span className={`text-lg ${PRIOTITYSTYELS[task?.priority]}`}>{ICONS[task?.priority]}</span>
            <span className="capitalize line-clamp-1">{task?.priority} Priority</span>
          </div>
        </td>

        <td className="py-2">
          <div className="flex items-center w-[7.5rem]">
            <span className="text-sm ">{formatDate(new Date(task?.date))}</span>
          </div>
        </td>

        <td className="py-2">
          <div className="flex items-center gap-3 w-[9rem] sm:w-[7rem] lg:mr-0 mr-0 md:mr-5">
            <div className="flex gap-2 items-center text-sm">
              <BiMessageDetail />
              <span>{task?.activities?.length}</span>
            </div>
            <div className="flex gap-2 items-center text-sm">
              <MdAttachFile />
              <span>{task?.assets?.length}</span>
            </div>
            <div className="flex gap-2 items-center text-sm text-gray-600">
              <FaList />
              <span>{task?.subTasks?.length}</span>
            </div>
          </div>
        </td>

        <td className="py-2">
          <div className="flex w-fit py-1 pr-7 md:pr-8 lg:pr-0">
            {task?.team?.map((m, index) => (
              <div key={m._id} className={`w-7 h-7 border-2  rounded-full text-white flex items-center justify-center text-sm -mr-1 ${BGS[index % BGS.length]}`}>
                {m?.image.length > 0 ? (
                  <>
                    <div>
                      <UserInfo user={m} color={index} />
                      <img src={m.image} alt="" className="w-full h-full rounded-full object-cover" />
                    </div>
                  </>
                ) : (
                  <UserInfo user={m} color={index} />
                )}
              </div>
            ))}
          </div>
        </td>

        <td className="py-2 flex gap-2 md:gap-4 justify-end pr-6">
          {user?.isAdmin || user?.isUstadz ? (
            <Button label="Edit" onClick={() => setOpenEdit(true)} type={'button'} className={` ${theme?.darkMode ? 'text-blue-400' : 'text-blue-600'} font-bold hover:text-blue-500 sm:px-0 text-sm md:text-base`} />
          ) : (
            <Button label="Null" onClick={() => {}} type={'button'} className={'text-blue-600 hover:text-blue-500 sm:px-0 text-sm md:text-base opacity-0'} />
          )}
          {user?.isAdmin ? (
            <Button label="Delete" type={'button'} className={`${theme?.darkMode ? 'text-red-400' : 'text-red-700'} hover:text-red-500 sm:px-0 font-bold text-sm md:text-base`} onClick={() => deleteClicks(task._id)} />
          ) : (
            <Button label="Null" type={'button'} className={'text-red-700 hover:text-red-500 sm:px-0 text-sm md:text-base opacity-0'} onClick={() => {}} />
          )}
        </td>
      </tr>
      <AddTask open={openEdit} setOpen={setOpenEdit} task={task} />
      <ConfirmationDialog open={openDialog} setOpen={setOpenDialog} onClick={deleteHandler} />
    </>
  );
};
export default TableRow;
