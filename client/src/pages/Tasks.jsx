import React, { useEffect, useState } from 'react'
import {FaList} from 'react-icons/fa'
import { MdGridView } from 'react-icons/md'
import { TASK_TYPE } from '../utils'
import { useLocation, useParams } from 'react-router-dom'
import {Button, Loading, Title, Tabs, TaskTitle, BoardView, Table, AddTask, Footer, Loading2} from '../components/'
import { IoMdAdd } from 'react-icons/io'
import { FaArrowRight, FaArrowLeft  } from "react-icons/fa";
import { useListQuery } from '../redux/slices/ActionApiSlice'
import { useListTaskMutation } from '../redux/slices/TaskApiSlice'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

const TABS = [
  {title: 'Board View', icon: <MdGridView />},
  {title: 'List View', icon: <FaList />},
]


const Tasks = () => {
  
  const {user, search} = useSelector(state=>state.auth)
  const object = {isTrashed:false, search}
  const params = useParams()
  const [selected, setSelected] = useState(parseInt(localStorage.getItem('selected')) || 0)
  const [open, setOpen] = useState(false)
  const status = params?.status || ''
  const [tasks, setTasks] = useState([])
  const [dataList, {isLoading}] = useListTaskMutation()
  const path = String(useLocation().pathname.split('/')[1].replace('-', ' '))
  const location = useLocation().search
  const query = new URLSearchParams(location)
  const [jumlahHalaman, setJumlahHalaman] = useState(0);
  const [ukuran, setUkuran] = useState(2);
  const itemPerPage = 15;
  const [halaman, setHalaman] = useState(parseInt(query.get('halaman')) || 1);
  const awalItem = (halaman - 1) * itemPerPage;
  const [dummyCondition, setDummyCondition] = useState(''); // Jangan DIhapus, berfungsi agar pengambilan data Api berjalan dengan lancar


  useEffect(()=>{
    if(tasks?.length == ukuran) {
      setDummyCondition('petok')
      setUkuran(0)
      setTasks(tasks?.filter(task=>path == 'tasks' || task.stage == path))
    }
  }, [ukuran])

  // useEffect(()=>{
  //   setHalaman( parseInt( parseInt(query.get('halaman')) || localStorage.getItem('halaman')) || 1)
  // },[path])

  useEffect(()=>{
    if(dummyCondition?.length > 1) {
      // setTasks(tasks?.filter(task=>path == 'tasks' || task.stage == path))
      setJumlahHalaman(Math.ceil(tasks?.length / itemPerPage))
      setDummyCondition('')
    }
  }, [dummyCondition])
  
  useEffect(()=>{
    
    setHalaman( parseInt( parseInt(query.get('halaman')) || localStorage.getItem('halaman')) || 1)
    const refetchitem = async()=>{
      try {
        const result = await dataList(object).unwrap()
        await setTasks(result.data)
        await setUkuran(result?.data?.length)
      } catch (error) {
        console.log(error)
        toast.error('gagal memuat data tasks')
      }
    }
    refetchitem();
  }, [path])
  


  return (
    isLoading ? (
      <Loading2 />
    ) : (
      <div className='w-full p-5'>
        <div className='flex items-center justify-between mb-4'>
          <Title title={status ? `${status} Tasks` : 'Tasks'}  />
          {!status && (<Button onClick={()=>setOpen(true)} icon={<IoMdAdd className='text-lg' />} label={'Create Task'} className={`${user.isAdmin ? 'flex':'hidden'} text-white flex-row-reverse gap-1 items-center bg-blue-700 py-2 2xl:py-2.5`} />)}
        </div>

          <Tabs tabs={TABS} setSelected={setSelected}>
            {!status && (
              <div className='w-full flex flex-col md:flex-row justify-between gap-4 md:gap-x-12 py-4'>
                <TaskTitle className={TASK_TYPE.todo} label={'To Do'} />
                <TaskTitle className={TASK_TYPE['in progress']} label={'In Progress'} />
                <TaskTitle className={TASK_TYPE.completed} label={'Complete'} />
              </div>
            )}

            {selected !== 1 ? <BoardView awalItem={awalItem} item={itemPerPage}  tasks={tasks} /> : <div className='w-full'><Table awalItem={awalItem} item={itemPerPage} tasks={tasks} halaman={halaman} jumlahHalaman={jumlahHalaman} /></div>}
          </Tabs>
            {isLoading ? null : <Footer itemPerPage={itemPerPage} ukuran={ukuran} setJumlahHalaman={setJumlahHalaman} tasks={tasks} halaman={halaman} jumlahHalaman={jumlahHalaman} />}
          <AddTask open={open} setOpen={setOpen} />

      </div>
    )
  )
}

export default Tasks