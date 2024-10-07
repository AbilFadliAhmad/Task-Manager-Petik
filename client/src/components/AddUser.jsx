import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import {ModalWrapper, Textbox, Loading, Button} from ".";
import { Dialog } from "@headlessui/react";
import { useListQuery, useRegisterMutation, useUpdateMutation } from "../redux/slices/ActionApiSlice";
import { toast } from "react-hot-toast";
import { img } from "../assets/data";
import { IoCameraSharp } from "react-icons/io5";
import { loadingDatab } from "../utils";

const AddUser = ({ open, setOpen, userData }) => {
  let defaultValues = userData ?? {};
  const { user } = useSelector((state) => state.auth);
  const [registerNewUser, {isLoading}] = useRegisterMutation()
  const [updateUser, {isLoading : isUpdating}] = useUpdateMutation()
  const { data, isLoading: isLoadingList, refetch } = useListQuery()
  const [ gambar, setGambar ] = useState(userData?.image ?? "https://cdn-icons-png.flaticon.com/512/149/149071.png")
  const [objectUrl, setObjectUrl] = useState(false)



  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const handleOnSubmit = async(data) => {
    try {

      if(userData) {
        const form = new FormData();
        form.append("name", data.name);
        form.append("email", data.email);
        form.append("title", data.title);
        form.append("role", data.role);
        form.append("password", data.password ?? '');
        form.append("image", gambar);
        form.append("id", data._id);
        const result = await updateUser(form).unwrap()
        setOpen(false)
        setObjectUrl(false)
        loadingDatab(refetch(),`User dengan id ${result.data._id} berhasil diupdate`, `User dengan id ${result.data._id} gagal diupdate`)
        .then(()=>setOpen(false))
        .then(()=>setTimeout(() => {
          window.location.reload();
        }, 1500))
      } else {
        const form = new FormData();
        form.append("name", data.name);
        form.append("email", data.email);
        form.append("title", data.title);
        form.append("role", data.role);
        form.append("password", data.password ?? '');
        form.append("image", gambar);

        const result = await registerNewUser(form).unwrap()
        loadingDatab(refetch(),`User dengan id ${result.data._id} berhasil ditambahkan`, `User dengan id ${result.data._id} gagal ditambahkan`)
        .then(()=>setTimeout(() => {
          window.location.reload();
        }, 1500))
  
        setTimeout(() => {
          setOpen(false)
          setObjectUrl(false)
        }, 500);
      }
    } catch (error) {
      console.log(error);
      toast.error( error.data.message ||"Ada sesuatu yang salah, silahkan hubungi pengembang")
    }
  };

  const handleChange = (e) => {
    setObjectUrl(true)
    setGambar(e.target.files[0])
  }

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className='h-[30rem]'>
          <Dialog.Title
            as='h2'
            className='text-base font-bold leading-6 text-gray-900 flex items-center justify-center mb-10'
          >
            {userData ? "UPDATE PROFILE" : "ADD NEW USER"}
          </Dialog.Title>
          <input {...register("_id")} hidden/>
          <input type="file" {...register("image")} id='image' accept='image/*' onChange={handleChange} hidden/>
          <div className='flex justify-center items-center h-[7rem] mb-7' >
            <div className="w-[8.5rem] h-[8.5rem] border border-gray-300 rounded-full shadow-lg relative">
              <label htmlFor="image">
                <img src={objectUrl ? URL.createObjectURL(gambar) : gambar} alt="Profile" className="w-full h-full rounded-full" />
              </label>
              <div className="w-10 h-10 absolute right-2 -bottom-1 border-[2px] border-blue-500 rounded-full bg-blue-500 flex items-center justify-center" >
                <label htmlFor="image">
                  <IoCameraSharp className="w-5 h-5 text-white" />
                </label>
              </div>
            </div>
          </div>
          <div className='mt-2 flex flex-col gap-6'>
            <Textbox
              placeholder='Full name'
              type='text'
              name='name'
              label='Full Name'
              className='w-full rounded'
              register={register("name", {
                required: "Full name is required!",
              })}
              error={errors.name ? errors.name.message : ""}
            />
            <Textbox
              placeholder='Title'
              type='text'
              name='title'
              label='Title'
              className='w-full rounded'
              register={register("title", {
                required: "Title is required!",
              })}
              error={errors.title ? errors.title.message : ""}
            />

            <Textbox
              placeholder='Email Address'
              type='email'
              name='email'
              label='Email Address'
              className='w-full rounded'
              register={register("email", {
                required: "Email Address is required!",
              })}
              error={errors.email ? errors.email.message : ""}
              // status={user}
            />

            {!userData || user.isAdmin && (
              <Textbox
                placeholder='Password'
                type='text'
                name='sandi'
                label='Password'
                className='w-full rounded'
                register={register("password", {
                  required: "Password is required!",
                })}
                error={errors.password ? errors.password.message : ""}
              />
            )}

            <Textbox
              placeholder='Role'
              type='text'
              name='role'
              label='Role'
              className='w-full rounded'
              register={register("role", {
                required: "User role is required!",
              })}
              error={errors.role ? errors.role.message : ""}
            />
          </div>

          {isLoading || isUpdating ? (
            <div className='py-5'>
              <Loading />
            </div>
          ) : (
            <div className='py-3 mt-4 sm:flex sm:flex-row-reverse'>
              <Button
                type='submit'
                className='bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto'
                label='Submit'
              />

              <Button
                type='button'
                className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto'
                onClick={() => setOpen(false)}
                label='Cancel'
              />
            </div>
          )}
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddUser;