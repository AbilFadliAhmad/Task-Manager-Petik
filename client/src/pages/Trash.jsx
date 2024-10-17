import React, { useEffect, useState } from 'react';
import { MdDelete, MdKeyboardArrowDown, MdKeyboardArrowUp, MdKeyboardDoubleArrowUp, MdOutlineRestore } from 'react-icons/md';
import { AddUser, Button, ConfirmationDialog, Loading2, Title } from '../components';
import { tasks } from '../assets/data';
import { loadingDatab, PRIOTITYSTYELS, TASK_TYPE } from '../utils';
import clsx from 'clsx';
import { useDeleteTaskMutation, useListTaskMutation } from '../redux/slices/TaskApiSlice';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  normal: <MdKeyboardArrowDown />,
};

const Trash = () => {
  const [dataList, { isLoading }] = useListTaskMutation();
  const [deleteTask, { isLoading: isLoadingDelete }] = useDeleteTaskMutation();
  const { search, theme } = useSelector((state) => state.auth);
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState('delete');
  const [searching, setSearching] = useState(search || '');
  const [tasks, setTasks] = useState([]);
  const [selected, setSelected] = useState('');

  const deleteAllClick = () => {
    setType('deleteAll');
    setMsg('Apakah kamu yakin akan menghapus permanen ke semua item ini?');
    setOpenDialog(true);
  };

  const restoreAllClick = () => {
    setType('restoreAll');
    setMsg('Apakah kamu Ingin Memulihkan semua item ini?');
    setOpenDialog(true);
  };

  const deleteClick = (user) => {
    setSelected({ id: user._id, name: user.title });
    setType('delete');
    setMsg('Apakah kamu yakin ingin menghapus permanen item ini?');
    setOpenDialog(true);
  };

  const restoreClick = (user) => {
    setSelected({ id: user._id, name: user.title });
    setType('restore');
    setMsg('Apakah kamu Yakin ingin memulihkan item ini?');
    setOpenDialog(true);
  };

  const handleKeyDown = (e) => {
    if (e.key == 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    localStorage.setItem('search', searching);
    window.location.reload();
  };

  const deleteRestoreHandler = async () => {
    try {
      const properti = { id: selected.id, action: type };
      loadingDatab(
        deleteTask(properti),
        `${
          type == 'restore'
            ? `Berhasil Memulihkan Tugas berjudul: ${selected?.name}`
            : type == 'delete'
            ? `Berhasil menghapus permanen Tugas berjudul: ${selected?.name}`
            : type == 'restoreAll'
            ? 'Berhasil Memulihkan semua Tugas'
            : 'Berhasil menghapus permanen semua Tugas'
        }`,
        `${
          type == 'restore'
            ? `Gagal Memulihkan Tugas berjudul: ${selected?.name}`
            : type == 'delete'
            ? `Gagal menghapus permanen Tugas berjudul: ${selected?.name}`
            : type == 'restoreAll'
            ? 'Gagal Memulihkan semua Tugas'
            : 'Gagal menghapus permanen semua Tugas'
        }`
      )
        .then(() => setOpen(false))
        .then(() =>
          setTimeout(() => {
            window.location.reload();
          }, 1800)
        );
    } catch (error) {
      console.log(error);
      toast.error('Gagal Menghapus Tugas');
    }
  };

  useEffect(() => {
    const fetchingData = async () => {
      const object = { isTrashed: true, search };
      const result = await dataList(object).unwrap();
      await setTasks(result.data);
    };
    fetchingData();
  }, [search]);

  const TableHeader = () => (
    <thead className={`w-full border-b ${theme.darkMode ? 'border-white text-white' : 'border-gray-300'}`}>
      <tr className="w-full  text-left">
        <th className="py-2">Task Title</th>
        <th className="py-2">Priority</th>
        <th className="py-2">Stage</th>
        <th className="py-2 line-clamp-1">Modified On</th>
      </tr>
    </thead>
  );

  const TableRow = ({ item }) => (
    <tr className={`border-b ${theme.darkMode ? 'border-white text-white hover:bg-gray-400/10' : 'border-gray-300  text-gray-600 hover:bg-gray-400/10'}`}>
      <td className="py-2">
        <div className="flex items-center gap-2">
          <div className={clsx('w-4 h-4 rounded-full', TASK_TYPE[item.stage])} />
          <p className="w-full line-clamp-2 text-base ">{item?.title}</p>
        </div>
      </td>

      <td className="py-2 capitalize">
        <div className={'flex gap-1 items-center'}>
          <span className={clsx('text-lg', PRIOTITYSTYELS[item?.priority])}>{ICONS[item?.priority]}</span>
          <span className="">{item?.priority}</span>
        </div>
      </td>

      <td className="py-2 capitalize text-center md:text-start">{item?.stage}</td>
      <td className="py-2 text-sm">{new Date(item?.date).toDateString()}</td>

      <td className="py-2 flex gap-1 justify-end">
        <Button icon={<MdOutlineRestore className="text-xl" />} onClick={() => restoreClick(item)} />
        <Button icon={<MdDelete className="text-xl text-red-600" />} onClick={() => deleteClick(item)} />
      </td>
    </tr>
  );

  return isLoading ? (
    <Loading2 />
  ) : (
    <>
      <div className="w-full md:p-4 p-0 mb-6">
        <div className="flex items-center justify-between mb-8 flex-col md:flex-row">
          <Title title="Trashed Tasks" className={`${theme.darkMode ? 'text-white' : ''}`} />

          <div className="flex gap-2 md:gap-4 items-center mt-4 md:mt-0">
            {tasks?.length > 0 && (
              <>
                <Button
                  label="Restore All"
                  icon={<MdOutlineRestore className="text-lg hidden md:flex" />}
                  className={`flex flex-row-reverse gap-1 items-center ${theme.darkMode ? 'text-white' : 'text-black'}  text-black text-sm md:text-base rounded-md 2xl:py-2.5`}
                  onClick={() => restoreAllClick()}
                />
                <Button
                  label="Delete All"
                  icon={<MdDelete className="text-lg hidden md:flex" />}
                  className="flex flex-row-reverse gap-1 items-center text-red-500 text-sm md:text-base rounded-md 2xl:py-2.5"
                  onClick={() => deleteAllClick()}
                />
              </>
            )}
          </div>
        </div>

        <div className="mb-4 flex justify-center md:justify-start">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              value={searching}
              autoFocus
              onKeyDown={handleKeyDown}
              onChange={(e) => setSearching(e.target.value)}
              placeholder="Search..."
              className="w-full p-2 pl-10 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <svg className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${theme.darkMode ? ' text-black' : 'text-gray-400'} `} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" onClick={handleSearch}>
              <path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387a1 1 0 01-1.414 1.414l-4.387-4.387zM8 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <div className={`seamlessly ${theme.darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'} px-2 md:px-6 py-4 shadow-md rounded`}>
          <div className="overflow-x-auto">
            <table className="w-full mb-5">
              <TableHeader />
              <tbody>
                {tasks?.map((tk, id) => (
                  <TableRow key={id} item={tk} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddUser open={open} setOpen={setOpen} />

      <ConfirmationDialog open={openDialog} setOpen={setOpenDialog} msg={msg} setMsg={setMsg} type={type} setType={setType} onClick={() => deleteRestoreHandler()} />
    </>
  );
};

export default Trash;
