import React from 'react';
import { Button, Textbox } from '../components';
import { useForm } from 'react-hook-form';
import emailjs from '@emailjs/browser'
import toast from 'react-hot-toast';
// import 
const AdminSupport = () => {

    const { register, handleSubmit, formState: { errors } } = useForm()

  

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

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 justify-center border border-gray-500 p-10 bg-white rounded-xl shadow-md max-h-[85%] overflow-x-auto">
        <div className="flex items-center justify-center flex-col gap-2 mb-6">
          <h1 className="text-2xl font-bold">Hubungi Admin</h1>
          <p className="text-sm text-gray-700">Pastikan data yang anda masukkan benar</p>
        </div>
        <Textbox register={register('name', { required: true })} type="text" placeholder="Nama Anda" label="Name" className={'h-4 w-[15rem] sm:w-[20rem] bg-white py-4 border-2 border-black rounded-lg'} />
        <Textbox register={register('email', { required: true })} type="email" placeholder="Email Anda" label="Email" className={'h-4 w-[15rem] sm:w-[20rem] bg-white py-4 border-2 border-black rounded-lg'} />
        <div className="flex flex-col">
          <label htmlFor="pesan">Pesan</label>
          <textarea
            type="text"
            {...register('message', { required: true })}
            className="w-[15rem] sm:w-[20rem] border border-gray-400 placeholder:text-sm sm:placeholder:text-lg px-4 min-h-[100px] h-[120px]   text-lg  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 py-2 "
            placeholder="Tulis Pesannya disini..."
          />
          <Button type='submit' label='Kirim' className='bg-blue-700 w-[15rem] sm:w-[20rem] text-white mt-4 hover:bg-green-600' />
        </div>
      </form>
    </div>
  );
};

export default AdminSupport;
