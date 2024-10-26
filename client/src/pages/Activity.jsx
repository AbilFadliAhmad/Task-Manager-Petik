import React, { useEffect, useState } from 'react';
import { Button, ConfirmationDialog, DetailsLog, Footer, Loading2, Title } from '../components';
import { GrDocumentUpdate } from 'react-icons/gr';
import { toast } from 'react-hot-toast';
import { useHistoryDeleteMutation, useHistoryMutation } from '../redux/slices/ActionApiSlice';
import { MdDelete, MdFolderDelete } from 'react-icons/md';
import { RiDeleteBack2Fill, RiLoginCircleFill, RiLoginCircleLine } from 'react-icons/ri';

import { FiLogOut } from 'react-icons/fi';
import { IoCreateOutline } from 'react-icons/io5';
import { HiOutlineDocumentDuplicate } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const Activity = () => {
  // const isLoading = false
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [openDelete, setOpenDelete] = useState(false);
  const [searching, setSearching] = useState(localStorage.getItem('searchLogs') || '');
  const [getLogs, { isLoading }] = useHistoryMutation();
  const [deleteLogs, { isLoading: isLoadingDelete }, refetch] = useHistoryDeleteMutation();
  const [logs, setLogs] = useState([]);
  const [text, setText] = useState('');
  const [action, setAction] = useState('');
  const {theme} = useSelector((state)=>state.auth)
  const path = String(useLocation().pathname.split('/')[1].replace('-', ' '));
  const location = useLocation().search;
  const query = new URLSearchParams(location);
  const [jumlahHalaman, setJumlahHalaman] = useState(0);
  const [ukuran, setUkuran] = useState(100000000000);
  const itemPerPage = 35;
  const [halaman, setHalaman] = useState(parseInt(query.get('halaman')) || 1);
  const awalItem = (halaman - 1) * itemPerPage;
  const [dummyCondition, setDummyCondition] = useState(''); // Jangan DIhapus, berfungsi agar pengambilan data Api berjalan dengan lancar
  const object = { search : localStorage.getItem('searchLogs') || '', itemPerPage, awalItem };

  

  const openLog = (log) => {
    setText(log);
    setOpen(true);
  };

  const handleSearch = () => {
    localStorage.setItem('searchLogs', searching);
    window.location.reload();
  };
  const handleKeyDown = (e) => {
    if (e.key == 'Enter') {
      handleSearch();
    }
  };

  const deleteClick = (log) => {
    setOpenDelete(true);
    setAction('delete');
    setText(log._id);
    setMsg(`Apakah kamu yakin ingin menghapus Logs ini?`);
  };

  const deleteAllClick = () => {
    setOpenDelete(true);
    setAction('deleteAll');
    setMsg(`Apakah kamu yakin ingin menghapus permanen ke semua logs ini?`);
  };

  const deleteHandler = async () => {
    let d;
    try {
      d = toast.loading('Menghapus Data...');
      await deleteLogs({ id: text, actionType: action })
        .unwrap()
        .then(() => setOpenDelete(false))
        .then(() => setOpen(false))
        .then(() =>
          setTimeout(() => {
            window.location.reload();
          }, 1800)
        )
        .then(() => toast.dismiss(d))
        .then(() => toast.success('Logs Berhasil di Hapus'));
    } catch (error) {
      toast.dismiss(d);
      toast.error('Gagal Menghapus Logs');
      console.log(error);
    }
  };

  const ICONS = {
    login: <RiLoginCircleLine className="text-blue-600" />,
    delete: <RiDeleteBack2Fill className="text-red-900" />,
    logout: <FiLogOut className="text-red-600" />,
    create: <IoCreateOutline className="text-cyan-400" />,
    update: <GrDocumentUpdate className="text-green-600" />,
    duplicate: <HiOutlineDocumentDuplicate className="text-yellow-600" />,
  };

  // useEffect(() => {
  //   const refetchData = async () => {
  //     try {
  //       const result = await getLogs(object).unwrap();
  //       setLogs(result?.logs);
  //     } catch (error) {
  //       console.log(error);
  //       toast.error('Gagal Mengambil Data Logs');
  //     }
  //   };
  //   refetchData();
  // }, []);

  useEffect(() => {
    if (logs?.length == ukuran) {
      setDummyCondition('petok');
      setUkuran(0);
    }
  }, [ukuran]);

  useEffect(() => {
    if (dummyCondition?.length > 1) {
      setJumlahHalaman(Math.ceil(logs?.length / itemPerPage));
      setLogs(logs?.slice(0, itemPerPage))
      setDummyCondition('');
      setLoading(false);
    }
  }, [dummyCondition]);

  useEffect(() => {
    if(halaman == 1) refetchitem();
    setHalaman(parseInt(parseInt(query.get('halaman')) || localStorage.getItem('halaman')) || 1);
    // refetchitem();
  }, [path]);

  useEffect(() => {
    refetchitem();
  }, [halaman]);

  const refetchitem = async () => {
    try {
      const result = await getLogs(object).unwrap();
      await setLogs(result.logs);
      await setUkuran(result.logs.length);
    } catch (error) {
      console.log(error);
      toast.error('gagal memuat data tasks, coba logout dan login ulang');
    }
  };

  const TableHeader = () => (
    <thead className={`w-full border-b ${theme.darkMode ? 'border-white text-white' : 'border-gray-300'} text-sm sm:text-lg`}>
      <tr className="w-full   text-left">
        <th className="py-2 px-4">Type</th>
        <th className="py-2 px-3 pl-6 sm:px-0 sm:pl-4">By</th>
        <th className="py-2 px-3 sm:px-4 line-clamp-1">Isi</th>
        <th className="py-2 px-3 sm:px-0">Date</th>
        {/* <th className='py-2 px-3 sm:px-0'>Aksi</th> */}
      </tr>
    </thead>
  );

  const TableRow = ({ log }) => (
    <tr className={`border-b ${theme.darkMode ? 'border-white text-white  hover:bg-gray-400/10' : 'border-gray-300 text-gray-600  hover:bg-gray-400/10'}`} onClick={() => openLog(log)}>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-5 text-lg h-full rounded-full">{ICONS[log?.type]}</div>
          <p className={`${theme.darkMode ? 'text-white' : 'text-black'} w-full line-clamp-2 uppercase  text-base`}>{log?.type}</p>
        </div>
      </td>

      <td className="pr-4 pl-3 capitalize">
        <div className={'flex gap-1 items-center'}>
          {/* <span className={clsx ('text-lg', PRIOTITYSTYELS[item?.priority])}>{ICONS[item?.priority]}</span> */}
          <span className="">{log?.by?.name}</span>
        </div>
      </td>

      <td className="px-2 capitalize text-start pr-4">
        <p className="line-clamp-1 w-[10%px]">{log?.rangkuman}</p>
      </td>
      <td className="py-2 text-sm ">
        <p className="w-[100px]">{log?.date.slice(0, 10)}</p>
      </td>

      <td className="py-2 flex gap-1 justify-end">
        <Button icon={<MdDelete className="text-xl text-red-600" />} onClick={() => deleteClick(log)} />
      </td>
    </tr>
  );

  return loading ? (
    <Loading2 />
  ) : (
    <>
      <div className="w-full md:p-4 p-0 mb-6">
        <div className="flex items-center justify-between mb-8 flex-col md:flex-row">
          <Title className={`${theme.darkMode ? 'text-white' : ''}`} title="Activity Logs" />
          <div className="flex gap-2 md:gap-4 items-center mt-4 md:mt-0">
            {/* <Button
              label="Delete PerHalaman"
              icon={<MdDelete className="text-lg hidden md:flex" />}
              className="flex flex-row-reverse gap-1 items-center text-black text-sm md:text-base rounded-md 2xl:py-2.5"
              onClick={() => deletePerHalaman()}
            /> */}
            {logs?.length > 1 && (
              <>
                <Button
                  label="Delete All"
                  icon={<MdDelete className="text-lg hidden md:flex" />}
                  className="flex flex-row-reverse gap-1 items-center text-red-600 text-sm md:text-base rounded-md 2xl:py-2.5"
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
              placeholder="Cari Berdasarkan Kolom Isi..."
              className="w-full p-2 pl-10 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent no-seamlessly"
            />
            <svg className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${theme.darkMode ? 'text-black' : 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" onClick={handleSearch}>
              <path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387a1 1 0 01-1.414 1.414l-4.387-4.387zM8 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <div className={`seamlessly ${theme.darkMode ? 'bg-gray-900' : 'bg-gray-100'} px-2 md:px-7 pt-4 pb-9 shadow-md rounded`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <TableHeader />
              <tbody>
                {logs?.map((log, index) => (
                  <TableRow key={index} log={log} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
        <Footer halaman={halaman} jumlahHalaman={jumlahHalaman} />

      <DetailsLog theme={theme} open={open} setOpen={setOpen} text={text} />

      <ConfirmationDialog open={openDelete} setOpen={setOpenDelete} msg={msg} setMsg={setMsg} onClick={deleteHandler} theme={theme.darkMode} />
    </>
  );
};

export default Activity;
