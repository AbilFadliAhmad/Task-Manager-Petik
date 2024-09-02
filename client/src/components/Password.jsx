import React from 'react'
import {Button, ModalWrapper, Textbox} from '.'
import { useForm } from 'react-hook-form'
import {toast} from 'react-hot-toast'
import { usePasswordMutation } from '../redux/slices/ActionApiSlice'

const Password = ({open, setOpen}) => {
    const {register, handleSubmit, formState: {errors}} = useForm()
    const [changePassword, {isLoading}] = usePasswordMutation()
    const handlePassword = async(data) => {
        try {
            if(data.password !== data.confirmation) {
                return toast.error('Password tidak cocok')
            }
            const result = await changePassword(data)
            console.log(result,  'result');
            toast.success('Password Berhasil Diubah')
            setOpen(false)
        } catch (error) {
            console.log(error)
            toast.error(error?.data?.message || error.message)
        }
    }

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
        <div className='flex flex-col gap-6'>
            <Textbox 
                className={'w-full rounded'} 
                label={'Password'} 
                placeholder={'Password'} 
                register={register('password', {required: 'Password is required!'})} 
                error={errors.password ? errors.password.message : ""}
                type={'password'} 
                />

            <Textbox 
                type={'password'} 
                className={'w-full rounded'} 
                label={'Confirmation'} 
                placeholder={'Masukkan Ulang Password'} 
                register={register('confirmation')} 
            />

            <div className='flex flex-row-reverse gap-5'>
                <Button label={'Simpan'} className='mt-5 bg-blue-500 text-white sm:w-[8rem] w-[5rem] outline-none rounded-2xl' onClick={handleSubmit(handlePassword)} />
                <Button label={'Cancel'} className='mt-5 bg-red-500 text-white sm:w-[8rem] w-[5rem] outline-none rounded-2xl' onClick={()=>setOpen(false)} />
            </div>
        </div>
    </ModalWrapper>
  )
}

export default Password