import React, { useState } from 'react'
import Login from './Login'
import {
  AddUser,
  Button,
  ConfirmationDialog,
  Loading,
  Title
} from '../components'
import { IoMdAdd } from 'react-icons/io'
import { getInitials, loadingDatab } from '../utils'
import { UserAction } from '../components/ConfirmationDialog'
import { useDeleteMutation, useListQuery, useStatusMutation } from '../redux/slices/ActionApiSlice'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'

const Users = () => {
  
  const [openDialog, setOpenDialog] = useState(false)
  const [open, setOpen] = useState(false)
  const [openAction, setOpenAction] = useState(false)
  const [selected, setSelected] = useState(null)
  const { data, isLoading, refetch } = useListQuery()
  const [statusAccount, {isLoading: isLoadingStatus}] = useStatusMutation()
  const [deleteAccount, {isLoading: isLoadingDelete}] = useDeleteMutation()
  const {theme} = useSelector(state => state.auth)

  const userActionHandler = async()=>{
    try {
      const result = await statusAccount({id:selected._id, isActive:!selected.isActive}).unwrap()
      loadingDatab(refetch(), `User bernama ${selected?.name} berhasil ${selected.isActive ? 'dinonaktifkan' : 'di Aktifkan Kembali'}`,`User bernama ${selected?.name} gagal ${selected.isActive ? 'dinonaktifkan' : 'diaktifkan'}`)
      .then(()=>setOpenAction(false))
      .then(()=>setTimeout(() => {
        window.location.reload()
      }, 1500))
    } catch (error) {
      console.log(error)
      toast.error(`User ${selected?.name} gagal ${selected.isActive ? 'dinonaktifkan' : 'diaktifkan'}`)
    }
  }
  
  const deleteHandler = async()=>{
   try {
    const id = selected._id
    const result = await deleteAccount(id).unwrap() 
    loadingDatab(deleteAccount(id), `User Bernama ${selected?.name} berhasil dihapus`, `User bernama ${selected?.name} gagal dihapus`)
    .then(()=>setOpenDialog(false))
    .then(()=>setTimeout(() => {
      window.location.reload()
    }, 1500))
   } catch (error) {
    console.log(error)
    toast.error(`User gagal Dihapus`)
   } 

  }
  const deleteClicks = (id)=>{
    setSelected(id)
    setOpenDialog(true)
  }

  const editClick = (id)=>{
    setSelected(id)
    setOpen(true)
  }

  const userStatusCLick = (id)=>{
    setSelected(id)
    setOpenAction(true)
  }

  const TableHeader = ()=>(
    <thead className={`${theme.darkMode ? 'border-white text-white' : 'border-gray-300'} w-full border-b  text-sm sm:text-lg`}>
      <tr className='w-full text-left'>
        <th className='py-2'>Full Name</th>
        <th className='py-2 px-3 pl-6 sm:px-0 sm:pl-0'>Title</th>
        <th className='py-2 px-3 sm:px-0 line-clamp-1'>Email</th>
        <th className='py-2 px-3 sm:px-0'>Role</th>
        <th className='py-2 px-3 sm:px-0'>Active</th>
      </tr>
    </thead>
    )
    const TableRow = ({user})=>(
      <tr className={`${theme.darkMode ? 'border-white text-white hover:bg-gray-400/20' : 'border-gray-300 text-gray-600 hover:bg-gray-400/100'} border-b  ${user.isAdmin ? `${theme.darkMode ? 'bg-yellow-600' : 'bg-yellow-200'}` : user.isUstadz ? 'bg-blue-500/20' : ''}  text-sm sm:text-lg`}>
        <td className='p-2'>
          <div className='flex items-center gap-3'>
            <div className={`w-11 h-11 rounded-full flex items-center justify-center ${user.image ? 'border-2 border-gray-300  sm:text-sm' : 'text-sm bg-blue-700 text-white'}`}>
              {user.image
              ? <img src={user.image} alt="" className='w-full h-full rounded-full object-cover' />
              : <span className='text-xs md:text-sm text-center'>
                  {getInitials(user?.name)}
                </span>}
            </div>
              <span>{user?.name}</span>
          </div>
        </td>

        <td className='px-3 pl-6 sm:px-0 sm:pl-0'>{user?.title}</td>
        <td className='px-3 sm:px-0'>{user?.email || 'user@gmail.com'}</td>
        <td className='px-3 sm:px-0'>{user?.role}</td>

        <td className='p-2 sm:p-0'>
          <button
          onClick={()=>userStatusCLick(user)}
          className={`w-fit px-4 py-1 rounded-full disabled:cursor-not-allowed text-white ${user?.isActive ? 'bg-blue-500' : 'bg-red-500'}`} disabled={user.isAdmin}>
            {user?.isActive ? "Active" : "Disabled"}
          </button>
        </td>

        <td className='p-2 flex gap-4'>
          <Button 
          label='Edit' 
          type={'button'} 
          className={`${theme.darkMode ? 'text-blue-100 hover:text-blue-500 font-bold' : 'text-blue-600 hover:text-blue-500'} sm:px-0 text-sm md:text-base`}
          onClick={() => editClick(user)}
          />

          <Button 
          label='Delete' 
          type={'button'} 
          className={`${theme.darkMode ? 'text-red-200 hover:text-red-500 font-bold' : 'text-red-700 hover:text-red-500'}  sm:px-0 text-sm md:text-base `} 
          onClick={() => deleteClicks(user)} 
          status={user}
          />
        </td>
      </tr>
    )

  return (
    <>
      <div className='w-full md:p-4 px-0 mb-6'>
          <div className='flex items-center justify-between mb-8'>
            <Title title='Team Members' className={`${theme.darkMode ? 'text-white' : ''} text-lg md:text-2xl`} />
            <Button onClick={() => {setOpen(true); setSelected(null)}} className={'flex flex-row-reverse gap-1 items-center bg-blue-500 text-white text-sm sm:text-lg w-[9rem] sm:w-[10.32rem]'} icon={<IoMdAdd className='text-lg' />} label={'Add New User'} />
          </div>

          <div className={` ${theme.darkMode ? 'bg-gray-900' : 'bg-gray-100'} px-2 md:px-4 pt-4 pb-9 shadow-md rounded`}>
          {isLoading ? (
            <Loading />
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <TableHeader />
                <tbody>
                  {data?.users?.map((user,index)=>(
                    <TableRow key={index} user={user} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
          </div>
      </div>

      <AddUser
        open={open}
        setOpen={setOpen}
        userData={selected}
        key={new Date().getTime().toString()}
      />

      <ConfirmationDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <UserAction
        open={openAction}
        setOpen={setOpenAction}
        onClick={userActionHandler}
        status={selected?.isActive}
      />

    </>
  )
}

export default Users