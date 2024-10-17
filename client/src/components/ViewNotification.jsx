import React from 'react'
import ModalWrapper from './ModalWrapper'
import Button from './Button'
import { useSelector } from 'react-redux'

const ViewNotification = ({open, setOpen, el}) => {
  const {user, theme} = useSelector(state=>state.auth)
  const text = el ? (user.isAdmin || user.isUstadz ? el.textLeader : el.text ) : [];
  const textM = el ? el.textMember : [];
  const title = el ? el?.task?.title : []
  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <div className={`flex flex-col relative ${theme.darkMode ? 'text-white' : ''}`}>
        <h1 className={`text-2xl uppercase mb-8 line-clamp-1 ${title ? 'text-natural-200' : 'text-red-600'}`}>{title ? title :'Pengumuman'}</h1>
        <p className='text-[1rem]'>{text[0] || textM[0] || 'Ada Sesuatu yang salah dalam surat ini, silahkan hubungi admin'}</p>
        <div className='mt-7 flex flex-row-reverse justify-between items-center'>
          <p className='text-[1rem]'>{text[1] || textM[1] || '00-00-0000'}</p>
          <button className=' bg-red-500 text-white sm:w-[2.5rem] h-[2rem] absolute -top-6 -right-6 w-[3rem] outline-none flex items-center justify-center' onClick={()=>setOpen(false)}>X</button>
        </div>
      </div>
    </ModalWrapper>
  )
}

export default ViewNotification