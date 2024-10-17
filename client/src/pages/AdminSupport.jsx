import React from 'react';
import { Button, Textbox } from '../components';
import { useForm } from 'react-hook-form';
import emailjs from '@emailjs/browser'
import toast from 'react-hot-toast';
import { IoIosHome } from "react-icons/io";
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
// import 
const AdminSupport = () => {

    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const {theme} = useSelector(state => state.auth)

  

  const onSubmit = async(data) => {
    const d = toast.loading('Sedang Mengirim...')
    await emailjs.send(
      import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
      {
        from_name: data.name,
        ke_nama: 'Admin',
        from_email: data.email,
        // to_email: 'khusus.sosmed098@gmail.com', // tidak berguna tidak usah diisi
        pesan: data.message,
      },
      import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY)
      .then(()=>toast.dismiss(d))
      .then(()=>toast.success('Pesan Terkirim'))
      .then(()=>setTimeout(() => {
        window.location.reload()
      }, 1800))
      .catch(()=>toast.error('Pesan Gagal Terkirim'))
  }

  // const handleBack = () => {
  //   <Navigate to="/log-in" />
  // }

  return (
    <div className={`w-full h-screen relative flex justify-center items-center ${theme.darkMode ? 'bg-gray-900 text-white' : 'text-black'}`}>
      <div className={`absolute top-[4rem] left-[4rem] flex items-end gap-2 cursor-pointer`} onClick={()=> navigate('/log-in')}>
        <IoIosHome className={`text-[4rem] `} />
        <p className='text-3xl font-bold'>Home</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col gap-2 justify-center border border-gray-500 p-10 ${theme.darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 '} rounded-xl shadow-md max-h-[85%] overflow-x-auto`}>
        <div className="flex items-center justify-center flex-col gap-2 mb-6">
          <h1 className="text-2xl font-bold">Hubungi Admin</h1>
          <p className={`text-sm ${theme.darkMode ? 'text-neutral-300' : 'text-gray-700'}`}>Pastikan data yang anda masukkan benar</p>
        </div>
        <Textbox theme={theme} register={register('name', { required: true })} type="text" placeholder="Nama Anda" label="Name" className={'h-10 w-[15rem] sm:w-[20rem] py-4 border-2 border-black rounded-lg'} />
        <Textbox theme={theme} register={register('email', { required: true })} type="email" placeholder="Email Anda" label="Email" className={'h-10 w-[15rem] sm:w-[20rem] py-4 border-2 border-black rounded-lg '} />
        <div className="flex flex-col">
          <label htmlFor="pesan">Pesan</label>
          <textarea
            type="text"
            {...register('message', { required: true })}
            className={`w-[15rem] sm:w-[20rem] placeholder:text-sm sm:placeholder:text-lg px-4 min-h-[100px] h-[120px] border-2   text-lg  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 py-2 ${theme.darkMode ? 'bg-transparent border-white' : 'border-gray-400'}`}
            placeholder="Tulis Pesannya disini..."
          />
          <Button type='submit' label='Kirim' className='bg-blue-700 w-[15rem] sm:w-[20rem] text-white mt-4 hover:bg-green-600' />
        </div>
      </form>
    </div>
  );
};

export default AdminSupport;
