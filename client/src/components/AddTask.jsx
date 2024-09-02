import React, { useEffect, useState } from 'react';
import { ModalWrapper, Textbox, SelectList, Button, SelectListDuplicate, AdminList, UserList, Loading } from '.';
import { Dialog, DialogTitle } from '@headlessui/react';
import { useForm  } from 'react-hook-form';
import {LISTS, loadingDatab, PRIORITY} from '../utils';
import { BiImages } from 'react-icons/bi';
import { useCreateMutation, useListTaskMutation, useUpdateTaskMutation } from '../redux/slices/TaskApiSlice';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';



const AddTask = ({task:task1, open, setOpen }) => {
  const {search} = useSelector(state=>state.auth)
  const object = {isTrashed:false, search}
  let task = task1 ? task1 : '';
  const [defaultValues, setDefaultValues] = useState(task ? { ...task, date: task.date.slice(0, 10) } : {})

  const [assets, setAssets] = useState(task1 ? task?.assets[0] : [])
  const {register, handleSubmit, formState: { errors }} = useForm({defaultValues});
  const handleSelect = (e)=>{
    setStatusAsset(true)
    setAssets(e.target.files[0])
  }
  const [leader, setLeader] = useState(task?.leader || [])
  const [team, setTeam] = useState(task?.team || [])
  const [stage, setStage ] = useState(task?.stage?.toUpperCase() || LISTS[0])
  const [priority, setPriority] = useState(task?.priority?.toUpperCase() || PRIORITY[0])
  const [addTask, {isLoading}] = useCreateMutation()
  const [udpateTask, {isLoading: isLoadingUpdate}] = useUpdateTaskMutation()
  const [refetchList] = useListTaskMutation()
  const [statusAsset, setStatusAsset] = useState(task1 ? true : false)
  const [buttonLoading, setButtonLoading] = useState(false)
  let toastD;

  const submitHandler = async(data)=>{
    if(!task) {
      try {
        setButtonLoading(true)
        toastD = toast.loading('Tunggu Sebentar...')
        const form = new FormData();
        form.append("title", data.title);
        form.append("date", data.date);
        form.append("priority", priority);
        form.append("stage", stage);
        form.append("team", team ?? []);
        form.append("leader", leader);
        form.append("image", assets);
        await addTask(form).unwrap()
        .then(()=>setOpen(false))
        .then(()=>setTimeout(() => {
          window.location.reload()
        }, 1800))
        .then(()=>toast.dismiss(toastD))
        .then(()=>toast.success('Task Berhasil Ditambahkan'))
      } catch (error) {
        toast.dismiss(toastD)
        toast.error(error.data.message)
        setButtonLoading(false)
        console.log(error, 'error');
      }
    } else {
      try {
        setButtonLoading(true)
        toastD = toast.loading('Tunggu Sebentar...')
        const form = new FormData();
        form.append("title", data.title);
        form.append("date", data.date);
        form.append("priority", priority);
        form.append("stage", stage);
        form.append("team", team ?? []);
        form.append("leader", leader ?? []);
        form.append("id", data._id);
        form.append("image", assets);
        await udpateTask(form).unwrap()
        .then(()=>toast.dismiss(toastD))
        .then(()=>toast.success("Task Berhasil Diupdate"))
        .then(()=>setOpen(false))
        .then(()=>setTimeout(() => {
          window.location.reload()
        }, 1800))
      } catch (error) {
        toast.dismiss(toastD)
        setButtonLoading(false)
        toast.error(error.data.message)
        console.log(error);
      }
    }
  }



  return (
    <div className=''>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(submitHandler)} className='h-[32.8rem] overflow-y-auto'>
          <input type="text" {...register('_id')} hidden />
          <DialogTitle as="h2" className={'text-base font-bold leading-6 text-gray-900 mb-4'}>
            {task ? 'UPDATE TASK' : 'ADD TASK'}
          </DialogTitle>
          <div className='mt-2 flex flex-col gap-6'>
            <Textbox 
              placeholder={'Task Title'} 
              type={'text'} 
              name={'title'} 
              label={'Task Title'} 
              className={'w-full rounded'} 
              register={register('title', {required: "Title is required"})} 
              error={errors.title ? errors.title.message : ''} 
            />
            <div className='flex border border-gray-300 rounded'>
              <AdminList leader={leader} setLeader={setLeader} onClick={()=>alert('ini perintah')} />
              <UserList team={team} setTeam={setTeam} leader={leader} className='' />
            </div>
            <div className='flex gap-4'>
              <SelectList selected={stage} setSelected={setStage} label={"Task Stage"} lists={LISTS}/>

              <div className='w-full'>
                <Textbox
                  placeholder={'date'}
                  type='date'
                  name='date'
                  label={'Task Date'}
                  className='w-full rounded'
                  register={register('date', {required: "Date is required"})}
                  error={errors.date ? errors.date.message : ''}
                />
              </div>
            </div>
            <div className='flex gap-4'>
              <SelectList
                label='Priority Level'
                lists={PRIORITY}
                selected={priority}
                setSelected={setPriority}
              />

              <div className='w-full flex items-center justify-center mt-4'>
                <label
                  className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4'
                  htmlFor='imgUpload'
                >
                  <input
                    type='file'
                    className='hidden'
                    id='imgUpload'
                    onChange={(e) => handleSelect(e)}
                    accept='.jpg, .png, .jpeg'
                  />
                  <BiImages />
                  <span>{statusAsset ? 'Ubah Assets' : 'Upload Assets'}</span>
                </label>
              </div>


            </div>
          </div>
          <div className='flex flex-row-reverse gap-5 mt-[2rem]'>
            {buttonLoading 
            ? <Loading /> 
            : (
              <><Button label={'Simpan'} className='mt-5 bg-blue-500 text-white sm:w-[8rem] w-[5rem] outline-none rounded-2xl' type={'submit'} />
            <Button label={'Cancel'} className='mt-5 bg-red-500 text-white sm:w-[8rem] w-[5rem] outline-none rounded-2xl' onClick={()=>setOpen(false)} /></>
            ) 
          }
            
          </div>
        </form>
      </ModalWrapper>
    </div>
  );
};

export default AddTask;
