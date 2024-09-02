import React, { useState } from 'react';
import { Button, Loading, Textbox } from '../components';
import { useForm } from 'react-hook-form';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import { IoCameraSharp } from 'react-icons/io5';
import { useCreateAdminMutation } from '../redux/slices/authApiSlice';
import { Navigate, useNavigate } from 'react-router-dom';
// import
const AdminSupport = () => {
  const [gambar, setGambar] = useState('https://cdn-icons-png.flaticon.com/512/149/149071.png');
  const [objectUrl, setObjectUrl] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [create, {isLoading}] = useCreateAdminMutation()
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    let d;
    try {
        setLoading(true)
        d=toast.loading('Sedang mengirim...')
        const form = new FormData();    
        form.append("name", data.name);
        form.append("email", data.email);
        form.append("password", data.password);
        form.append("image", gambar);
        form.append("isAdmin", true);
        await create(form)
        .then(()=>toast.dismiss(d))
        .then(()=>toast.success(`Admin  berhasil ditambahkan`))
        .then(()=>setTimeout(() => window.location.reload(), 1500))
        .then(()=>navigate('/log-in'))
    } catch (error) {
        setLoading(false)
        toast.dismiss(d)
        console.log(error)
        toast.error(error?.data?.message || "Admin Gagal Ditambahkan")
    }
  };

  const handleChange = (e) => {
    setObjectUrl(true)
    setGambar(e.target.files[0])
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 justify-center border border-gray-500 p-10 bg-white rounded-xl shadow-md max-h-[85%] overflow-x-auto">
        <input {...register('_id')} hidden />
        <input type="file" {...register('image')} id="image" accept="image/*" onChange={handleChange} hidden />
        <div className="flex justify-center items-center h-[7rem] mb-7">
          <div className="w-[8.5rem] h-[8.5rem] border border-gray-300 rounded-full shadow-lg relative">
            <label htmlFor="image">
              <img src={objectUrl ? URL.createObjectURL(gambar) : gambar} alt="Profile" className="w-full h-full rounded-full" />
            </label>
            <div className="w-10 h-10 absolute right-2 -bottom-1 border-[2px] border-blue-500 rounded-full bg-blue-500 flex items-center justify-center">
              <label htmlFor="image">
                <IoCameraSharp className="w-5 h-5 text-white" />
              </label>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center flex-col gap-2 mb-6">
          <h1 className="text-2xl font-bold">Buat Akun Admin</h1>
          <p className="text-sm text-gray-700">Pastikan nonaktifkan halaman ini setelah digunakan</p>
        </div>
        <Textbox register={register('name', { required: true })} type="text" placeholder="Nama Admin" label="Name" className={'h-4 w-[15rem] sm:w-[20rem] bg-white py-4 border-2 border-black rounded-lg'} />
        <Textbox register={register('email', { required: true })} type="email" placeholder="Email Admin" label="Email" className={'h-4 w-[15rem] sm:w-[20rem] bg-white py-4 border-2 border-black rounded-lg'} />
        <Textbox register={register('password', { required: true })} type="password" placeholder="Password Admin" label="Password" className={'h-4 w-[15rem] sm:w-[20rem] bg-white py-4 border-2 border-black rounded-lg'} />
        <div className="flex flex-col">
            {loading 
            ? <Loading /> 
            : <Button type="submit" label="Kirim" className="bg-blue-500 w-[15rem] sm:w-[20rem] text-white mt-4 hover:bg-green-600" />
            }
        </div>
      </form>
    </div>
  );
};

export default AdminSupport;
