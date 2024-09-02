import { MdAttachFile, MdKeyboardArrowDown, MdKeyboardArrowUp, MdKeyboardDoubleArrowUp } from 'react-icons/md';
import { BGS, formatDate, PRIOTITYSTYELS, TASK_TYPE } from '../utils';
import { BiMessageDetail } from 'react-icons/bi';
import { FaList } from 'react-icons/fa';
import UserInfo from './UserInfo';
import Button from './Button';
import { AddTask, ConfirmationDialog } from '.';
import React from 'react';

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  normal: <MdKeyboardArrowDown />,
};

const TableRow = ({ task }) => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [selected, setSelected] = React.useState([]);

  const deleteClicks = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClicks = (task) => {
    setSelected(task);
    setOpenEdit(true);
  };

  const deleteHandler = () => {};

  return (
    <>
      <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-300/10">
        <td className="py-2 pr-8 sm:pr-0">
          <div className="flex items-center gap-2 lg:pr-0 pr-0 md:pr-4">
            <div className={`w-4 h-4 rounded-full pr-4 ${TASK_TYPE[task?.stage]}`}></div>
            <p className="w-full line-clamp-2 text-base text-black">{task?.title}</p>
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
            <span className="text-sm text-gray-600 ">{formatDate(new Date(task?.date))}</span>
          </div>
        </td>

        <td className="py-2">
          <div className="flex items-center gap-3 w-[9rem] sm:w-[7rem] lg:mr-0 mr-0 md:mr-5">
            <div className="flex gap-2 items-center text-sm text-gray-600">
              <BiMessageDetail />
              <span>{task?.activities?.length}</span>
            </div>
            <div className="flex gap-2 items-center text-sm text-gray-600">
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
          <div className="flex border w-fit py-1 pr-7 md:pr-8 lg:pr-0">
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
          <Button label="Edit" onClick={() => setOpenEdit(true)} type={'button'} className={'text-blue-600 hover:text-blue-500 sm:px-0 text-sm md:text-base'} />
          <Button label="Delete" type={'button'} className={'text-red-700 hover:text-red-500 sm:px-0 text-sm md:text-base'} onClick={() => deleteClicks(task._id)} />
        </td>
      </tr>
      <AddTask open={openEdit} setOpen={setOpenEdit} task={task} />
      <ConfirmationDialog open={openDialog} setOpen={setOpenDialog} onClick={deleteHandler} />
    </>
  );
};
export default TableRow;
