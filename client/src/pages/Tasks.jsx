import { useEffect, useState } from 'react';
import { FaList } from 'react-icons/fa';
import { MdGridView } from 'react-icons/md';
import { filteringDataTasks, TASK_TYPE } from '../utils';
import { useLocation, useParams } from 'react-router-dom';
import { Button, Title, Tabs, TaskTitle, BoardView, Table, AddTask, Footer, Loading2 } from '../components/';
import { IoMdAdd } from 'react-icons/io';
import { useListTaskMutation } from '../redux/slices/TaskApiSlice';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FiRefreshCcw } from 'react-icons/fi';

const TABS = [
  { title: 'Board View', icon: <MdGridView /> },
  { title: 'List View', icon: <FaList /> },
];

const Tasks = () => {
  const { user, search, theme } = useSelector((state) => state.auth);
  const params = useParams();
  const status = params?.status || '';
  const [selected, setSelected] = useState(parseInt(localStorage.getItem('selected')) || 0);
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [arrayItem, setArrayItem] = useState(localStorage.getItem('filteringData') ? JSON.parse(localStorage.getItem('filteringData')) : []);
  const [dataList, { isLoading }] = useListTaskMutation();
  const path = String(useLocation().pathname.split('/')[1].replace('-', ' '));
  const location = useLocation().search;
  const query = new URLSearchParams(location);
  const [jumlahHalaman, setJumlahHalaman] = useState(0);
  const [ukuran, setUkuran] = useState(9999);
  const itemPerPage = 15;
  const [halaman, setHalaman] = useState(parseInt(query.get('halaman')) || 1);
  const awalItem = (halaman - 1) * itemPerPage;
  const [dummyCondition, setDummyCondition] = useState(''); // Jangan DIhapus, berfungsi agar pengambilan data Api berjalan dengan lancar
  const object = { isTrashed: false, search, itemPerPage, awalItem, path, arrayItem };

  useEffect(() => {
    if (tasks?.length == ukuran) {
      setDummyCondition('petok');
      path == 'tasks' && setArrayItem(filteringDataTasks(tasks));
      setUkuran(500);
    }
  }, [ukuran]);

  useEffect(() => {
    if (dummyCondition?.length > 1) {
      setJumlahHalaman(Math.ceil(tasks?.length / itemPerPage));
      setDummyCondition('');
      // setHalaman(1);
    }
  }, [dummyCondition]);


  useEffect(() => {
    if (halaman == 1) {
      refetchitem();
      console.log('ini dimana')
      // Kode ini buat pindah ke halaman 2
    }
    setArrayItem([])
    setTasks([])
    setHalaman(parseInt(parseInt(query.get('halaman')) || localStorage.getItem('halaman')) || 1);
  }, [path]);

  useEffect(() => {
    // arrayItem.length > 0 || (path == 'tasks' && refetchitem());
    refetchitem();
  }, [halaman]);

  const refetchitem = async () => {
    try {
      await setArrayItem([]);
      const result = await dataList(object).unwrap();
      await setTasks(result.data);
      await setUkuran(result.data.length);
    } catch (error) {
      console.log(error);
      toast.error('gagal memuat data tasks, coba logout dan login ulang');
    }
  };

  return isLoading ? (
    <Loading2 />
  ) : (
    <div className="w-full p-5 seamlessly">
      <div className="flex items-center justify-start mb-4">
        <Title title={status ? `${status} Tasks` : 'Tasks'} className={`${theme.darkMode ? 'text-white' : ''}`} />
        <div className="ml-auto flex sm:flex-row flex-col sm:gap-7 gap-2">
          <Button onClick={refetchitem} icon={<FiRefreshCcw className="text-lg" />} label={'Refresh Task'} className={`${user.isAdmin ? 'flex' : 'flex'} text-white flex-row-reverse gap-3 items-center bg-blue-700 py-2 2xl:py-2.5`} />
          {!status && (
            <Button onClick={() => setOpen(true)} icon={<IoMdAdd className="text-lg" />} label={'Create Task'} className={`${user.isAdmin ? 'flex' : 'hidden'} text-white flex-row-reverse gap-1 items-center bg-blue-700 py-2 2xl:py-2.5`} />
          )}
        </div>
      </div>

      <Tabs arrayItem={arrayItem} setArrayItem={setArrayItem} path={path} tabs={TABS} setSelected={setSelected}>
        {!status && (
          <div className={`w-full flex flex-col md:flex-row justify-between gap-4 md:gap-x-12 py-4`}>
            <TaskTitle className={TASK_TYPE.todo} label={'To Do'} />
            <TaskTitle className={TASK_TYPE['in progress']} label={'In Progress'} />
            <TaskTitle className={TASK_TYPE.completed} label={'Complete'} />
          </div>
        )}

        {selected !== 1 ? (
          <BoardView awalItem={awalItem} item={itemPerPage} tasks={tasks} />
        ) : (
          <div className="w-full">
            <Table awalItem={awalItem} item={itemPerPage} tasks={tasks} halaman={halaman} jumlahHalaman={jumlahHalaman} />
          </div>
        )}
      </Tabs>
      {isLoading ? null : tasks.length > 0 && <Footer halaman={halaman} jumlahHalaman={jumlahHalaman} />}
      <AddTask open={open} setOpen={setOpen} />
    </div>
  );
};

export default Tasks;
