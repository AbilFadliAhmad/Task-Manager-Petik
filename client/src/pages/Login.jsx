import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import {Textbox, Button} from '../components';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../redux/slices/authApiSlice';
import { toast } from 'react-hot-toast';
import { setCredentials } from '../redux/slices/authSlice';
import { Loading } from '../components';
import { img } from '../assets/data';

const Login = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const submitHandler = async(data)=>{
    try {
      const result = await login(data).unwrap();
      console.log(result.data, 'login page');
      dispatch(setCredentials(result.data));
      navigate('/');
      window.location.reload()  
    } catch (error) {
      console.log(error,'ini bagian error');
      toast.error(error?.data?.message || error.message);
    }
  }

  useEffect(() => {
    user && navigate('/dashboard');
  }, [user]);


  return (
    <div className='w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f4f5f6]'>
      <div className="w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center">

        {/* Left Side */}
        <div className='h-full w-full lg:w-2/3 flex flex-col items-center justify-center'>
          <div className='w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20'>
            <p className='flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center' style={{ background: '-webkit-linear-gradient(left, rgb(255, 221, 87), rgb(91, 253, 153)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              <span>TaskPeTIK</span>
            </p>

            <div className='cell flex items-center justify-center '>
              <div className='floating-animation flex items-center justify-center'> 
                <img src={img.petik} alt="Descriptive Text" className='md:w-full md:h-auto sm:w-[12rem] sm:h-auto '  />
              </div>
            </div>
          </div>
        </div>
        
        {/* Rigng Side */}
        <div className='w-full md:w-1/3 p-4 md:p-1 fkex flex-col justify-center items-center'>
          <form  onSubmit={handleSubmit(submitHandler)} className="form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14">
            <div className=''>
              <p className='text-green-500 text-2xl font-bold text-center'>Selamat Datang Kembali</p>
              <p className='text-center text-base text-gray-700'>Jaga kredensial anda tetap aman</p>
            </div>
            <div className='flex flex-col gap-y-5'>
            <Textbox
                placeholder='email@example.com'
                type='email'
                name='email'
                label='Email Address'
                className='w-full rounded-full'
                register={register("email", { required: "Email Address is required!" })}
                error={errors.email ? errors.email.message : ""}
              />

            <Textbox
                placeholder='password'
                type='password'
                name='password'
                label='Password'
                className='w-full rounded-full'
                register={register("password", { required: "Password is required!" })}
                error={errors.password ? errors.password.message : ""}
              />
              <Link to={'/admin-support'} className='text-sm text-gray-500 hover:text-blue-600 hover:underline cursor-pointer'>
                Hubungi Admin?
              </Link>
              {isLoading ? <Loading /> : <Button
                type='submit'
                label='Login'
                className='bg-blue-700 text-white hover:bg-green-600'
              />}
            </div>
          </form>
        </div>

      </div>
    </div>
  )
};

export default Login;
