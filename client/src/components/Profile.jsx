import React from 'react';
import { Button, Loading, ModalWrapper, Textbox } from '.';
import { useDispatch, useSelector } from 'react-redux';
import { getInitials } from '../utils';
import { useForm } from 'react-hook-form';
import { useProfileMutation } from '../redux/slices/ActionApiSlice';
import { setCredentials } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';
import { IoCameraSharp } from 'react-icons/io5';

const Profile = ({ open, setOpen }) => {
  const { user, theme } = useSelector((state) => state.auth);
  const [gambar, setGambar] = React.useState(user.image ?? null);
  const [objectUrl, setObjectUrl] = React.useState(false);
  let defaultValues = user ?? {};
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });
  const [updateProfile, { isLoading }] = useProfileMutation();

  const handleUpdate = async (data) => {
    try {
      const form = new FormData();
      form.append('name', data.name);
      form.append('email', data.email);
      form.append('title', data.title);
      form.append('role', data.role);
      form.append('image', gambar);

      const result = await updateProfile(form).unwrap();
      dispatch(setCredentials(result.data));
      setOpen(false);
      toast.success('Profil berhasil diperbarui');
    } catch (error) {
      console.log(error);
      toast.error('Gagal memperbarui profil, silahkan coba lagi');
    }
  };

  const handleChange = (e) => {
    setObjectUrl(true);
    setGambar(e.target.files[0]);
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form>
        <div className="h-[31rem]">
          <div className="w-full flex flex-col justify-center items-center gap-5">
            <div className={`w-[8rem] relative h-[8rem] flex items-center justify-center rounded-full ${user.image ? 'border border-gray-400 shadow-lg' : 'text-[3rem] text-white bg-blue-500'}`}>
              <input type="file" hidden accept="image/*" id="image" onChange={handleChange} />
              <label htmlFor="image">{gambar ? <img src={objectUrl ? URL.createObjectURL(gambar) : gambar} alt="" className="w-full h-full rounded-full" /> : getInitials(user?.name)}</label>
              <div className="w-10 h-10 absolute right-2 -bottom-1 border-[2px] border-blue-500 rounded-full bg-blue-500 flex items-center justify-center">
                <label htmlFor="image">
                  <IoCameraSharp className="w-5 h-5 text-white" />
                </label>
              </div>
            </div>
            <h1 className={`text-2xl font-bold mb-5 ${theme.darkMode ? 'text-white' : ''}`}>Akun Profil</h1>
            <Textbox theme={theme} label={'Nama'} placeholder={'Nama Akun'} className={'w-full rounded'} register={register('name', { required: 'Full name is required!' })} error={errors.name ? errors.name.message : ''} />
            <Textbox theme={theme} label={'Title'} placeholder={'Title Akun'} className={'w-full rounded'} register={register('title', { required: 'title is required!' })} error={errors.title ? errors.title.message : ''} />
            <Textbox theme={theme} label={'Email'} placeholder={'Email Pengguna'} className={'w-full rounded '} register={register('email', { required: 'Email is required!' })} error={errors.email ? errors.email.message : ''} status={user} />
            <Textbox theme={theme} label={'Role'} placeholder={'Role Pengguna'} className={'w-full rounded'} register={register('role', { required: 'Role content is required!' })} error={errors.role ? errors.role.message : ''} />
          </div>
          {isLoading ? <div className="flex flex-row-reverse gap-5 mt-5"><Loading /></div> 
          : 
          <div className="flex flex-row-reverse gap-5">
            <Button label={'Simpan'} className="mt-5 bg-blue-500 text-white sm:w-[8rem] w-[5rem] outline-none rounded-2xl" onClick={handleSubmit(handleUpdate)} />
            <Button label={'Cancel'} className="mt-5 bg-red-500 text-white sm:w-[8rem] w-[5rem] outline-none rounded-2xl" onClick={() => setOpen(false)} />
          </div>}
          <div className="flex flex-row-reverse gap-5 h-[0px] invisible">
            <p>o</p>
          </div>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default Profile;
