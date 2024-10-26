import React, { useEffect, useState } from 'react';
import { ModalWrapper, Textbox, SelectList, Button, SelectListDuplicate, AdminList, UserList, Loading } from '.';
import { Dialog, DialogTitle } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { LISTS, loadingDatab, PRIORITY } from '../utils';
import { BiImages } from 'react-icons/bi';
import { useCreateMutation, useListTaskMutation, useUpdateTaskMutation } from '../redux/slices/TaskApiSlice';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { AiFillContacts } from 'react-icons/ai';

const AddTask = ({ task: task1, open, setOpen }) => {
  const { user, theme } = useSelector((state) => state.auth);
  let task = task1 ? task1 : '';
  const [defaultValues, setDefaultValues] = useState(task ? { ...task, date: task.date.slice(0, 10), deadline: new Date().toLocaleDateString('id-ID').split('/').reverse().join('-') } : {});

  const [assets, setAssets] = useState(task1 ? task?.assets[0] : []);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues });
  const handleSelect = (e) => {
    setStatusAsset(true);
    setAssets(e.target.files[0]);
  };
  const [leader, setLeader] = useState(task?.leader || []);
  const [team, setTeam] = useState(task?.team || []);
  const [stage, setStage] = useState(task?.stage?.toUpperCase() || LISTS[0]);
  const [priority, setPriority] = useState(task?.priority?.toUpperCase() || PRIORITY[0]);
  const [check, setCheck] = useState(task?.timer ?? false);
  const [addTask, { isLoading }] = useCreateMutation();
  const [udpateTask, { isLoading: isLoadingUpdate }] = useUpdateTaskMutation();
  // const [refetchList] = useListTaskMutation();
  const [statusAsset, setStatusAsset] = useState(task1 ? true : false);
  const [buttonLoading, setButtonLoading] = useState(false);
  let toastD;
  const currentDateCode = new Date()
    .toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
    })
    .split(', ')[0]
    .split('/');
  const [day, month, year] = currentDateCode;
  const currentDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  const date = watch('date');

  const submitHandler = async (data) => {
    if (!task) {
      try {
        setButtonLoading(true);
        toastD = toast.loading('Tunggu Sebentar...');
        const form = new FormData();
        form.append('title', data.title);
        form.append('date', data.date);
        form.append('priority', priority);
        form.append('stage', stage);
        form.append('team', team.map((item) => item._id) ?? []);
        form.append('leader', leader.map((item) => item._id) ?? []);
        form.append('image', assets);
        form.append('timer', check);
        check && data.deadline.length > 0 ? form.append('deadline', data.deadline) : form.append('deadline', []);
        await addTask(form)
          .unwrap()
          .then(() => setOpen(false))
          .then(() =>
            setTimeout(() => {
              window.location.reload();
            }, 1800)
          )
          .then(() => toast.dismiss(toastD))
          .then(() => toast.success('Task Berhasil Ditambahkan'));
      } catch (error) {
        toast.dismiss(toastD);
        toast.error(error.data.message);
        setButtonLoading(false);
        console.log(error, 'error');
      }
    } else {
      try {
        setButtonLoading(true);
        if (task?.isExpired && !user.isAdmin) {
          toast.error('Task Expired, Tidak Bisa Diubah');
          setButtonLoading(false);
          setOpen(false);
          return;
        }
        toastD = toast.loading('Tunggu Sebentar...');
        const form = new FormData();
        form.append('title', data.title);
        form.append('date', data.date);
        form.append('priority', priority);
        form.append('stage', stage);
        form.append('team', team.map((item) => item._id) ?? []);
        form.append('leader', leader.map((item) => item._id) ?? []);
        form.append('id', data._id);
        form.append('image', assets);
        if(!user?.isAdmin) {
          null
        } else if(user?.isAdmin && currentDate == date) {
          form.append('timer', check);
          data.deadline.length > 0 && check ? form.append('deadline', data.deadline) : !check ? form.append('deadline', '2174-12-23') : form.append('deadline', []);
        }
        await udpateTask(form)
          .unwrap()
          .then(() => toast.dismiss(toastD))
          .then(() => toast.success('Task Berhasil Diupdate'))
          .then(() => setOpen(false))
          .then(() =>
            setTimeout(() => {
              window.location.reload();
            }, 1800)
          );
      } catch (error) {
        toast.dismiss(toastD);
        setButtonLoading(false);
        toast.error('Pastikan internetmu stabil');
        console.log(error);
      }
    }
  };
  

  return (
    <div className="">
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(submitHandler)} className="h-[32.8rem] overflow-y-auto">
          <input type="text" {...register('_id')} hidden />
          <DialogTitle as="h2" className={'text-base font-bold leading-6 text-gray-900 mb-4'}>
            {task ? 'UPDATE TASK' : 'ADD TASK'}
          </DialogTitle>
          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder={'Judul Tugas'}
              type={'text'}
              name={'title'}
              label={'Task Title'}
              className={'w-full rounded'}
              register={register('title', { required: 'Title is required' })}
              error={errors.title ? errors.title.message : ''}
              theme={theme}
            />
            <div className="flex border border-gray-300">
              <AdminList theme={theme} leader={leader} setLeader={setLeader} onClick={() => alert('ini perintah')} />
              <UserList theme={theme} team={team} setTeam={setTeam} leader={leader} className="" />
            </div>
            <div className="flex gap-4">
              <SelectList theme={theme} selected={stage} setSelected={setStage} label={'Task Stage'} lists={LISTS} />

              <div className="w-full">
                <Textbox placeholder={'date'} type="date" name="date" label={'Task Date'} className="w-full rounded" register={register('date', { required: 'Date is required' })} error={errors.date ? errors.date.message : ''} theme={theme} status={user} />
              </div>
            </div>
            <div className="flex gap-4">
              <SelectList theme={theme} label="Priority Level" lists={PRIORITY} selected={priority} setSelected={setPriority} />

              <div className={`${theme.darkMode ? ' text-white' : ''} w-full flex items-center justify-center mt-4`}>
                <label className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4" htmlFor="imgUpload">
                  <input type="file" className="hidden" id="imgUpload" onChange={(e) => handleSelect(e)} accept=".jpg, .png, .jpeg" />
                  <BiImages />
                  <span>{statusAsset ? 'Ubah Assets' : 'Upload Assets'}</span>
                </label>
              </div>
            </div>
            {currentDate == date && user?.isAdmin ? (
              <div className="mt-1">
                <div className="w-full flex justify-between">
                  <div className="w-[48%] h-[2.8rem]">
                    <div className={`flex items-center w-fulll h-full justify-center ${theme.darkMode ? 'bg-transparent' : 'bg-white'} mt-7`}>
                      <input type="checkbox" name="" id="check" checked={check} onChange={() => (setCheck((prev)=>!prev))} className='hidden' />
                      <label htmlFor="check" className='bg-gray-300 w-[5rem] h-[2rem] rounded-3xl cursor-pointer relative' id='checkLabel'></label>
                    </div>
                  </div>
                  <div className={`w-[48%] h-[5rem] relative ${check ? '' : 'opacity-40 cursor-not-allowed'}`}>
                    <AiFillContacts className={`text-[15rem] absolute -top-10 -left-3 w-[16rem] h-[10rem] cursor-not-allowed opacity-0 ${check ? 'invisible' : ''}`} />
                    <Textbox theme={theme} placeholder={'0'} type={'date'} label={'Set Deadline'} name={'deadline'} className={'w-full rounded'} register={register('deadline')}  />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <div className="flex flex-row-reverse gap-5 mt-[2rem]">
            {buttonLoading ? (
              <Loading />
            ) : (
              <>
                <Button label={'Simpan'} className="mt-5 bg-blue-500 text-white sm:w-[8rem] w-[5rem] outline-none rounded-2xl" type={'submit'} />
                <Button label={'Cancel'} className="mt-5 bg-red-500 text-white sm:w-[8rem] w-[5rem] outline-none rounded-2xl" onClick={() => setOpen(false)} />
              </>
            )}
          </div>
        </form>
      </ModalWrapper>
    </div>
  );
};

export default AddTask;
