import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiTwotoneFolderOpen } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { HiDuplicate } from "react-icons/hi";
import { MdAdd, MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Menu, Transition } from "@headlessui/react";
import {AddTask, AddSubTask, ConfirmationDialog} from ".";
import { useDeleteTaskMutation, useDuplicateTaskMutation, useListTaskMutation } from "../redux/slices/TaskApiSlice";
import { useListQuery } from "../redux/slices/ActionApiSlice";
import toast from "react-hot-toast";
import { loadingDatab } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import { setStartCount } from "../redux/slices/authSlice";


const TaskDialog = ({task}) => {
  const {search} = useSelector(state=>state.auth)
  const object = {isTrashed:false, search}
  const [open, setOpen] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const navigate = useNavigate()
  const [duplicate, {isLoading}] = useDuplicateTaskMutation()
  const [deleteTask] = useDeleteTaskMutation()
  const [refetch] = useListTaskMutation()
  const {user} = useSelector(state=>state.auth)
  const dispatch = useDispatch();

  useEffect(()=>{
    if(openEdit){
      dispatch(setStartCount(false))
    } else if (!openEdit){
      dispatch(setStartCount(true))
    }
  }, [openEdit])
  
  const duplicateHanlder = async() => {
    try {
      const form = new FormData();
      form.append("id", task._id)
      const result = await duplicate(form)
      if(result.data.success){
        loadingDatab(refetch(object), `Berhasil menduplikat tugas berjudul: ${task?.title}`, `Gagal menduplikat tugas berjudul: ${task?.title}`)
        .then(()=>setTimeout(() => {
          window.location.reload()
        }, 1100))
      }
    } catch (error) {
      console.log(error)
      toast.error("gagal menduplikat task")
    }
  }
  const deleteClicks=()=>{
    setOpenDialog(true)
  }

  const deleteHandler= async()=>{
    try {
      const object = {
        id: task._id,
        action: "deleteTemporary"
      }
      const result = await deleteTask(object)
      if(result.data.success){
        loadingDatab(refetch(object), `Berhasil Menghapus Tugas berjudul ${task?.title}`, `Gagal Menghapus Tugas berjudul ${task?.title}`)
        .then(()=>setOpenDialog(false))
        .then(()=>setTimeout(() => window.location.reload(), 1100))
      }
    } catch (error) {
      console.log(error);
      toast.error("Ada sesuatu yang salah saat menghapus task");
    }
  }
  
  const items = [
    {
      label: "Open Task",
      icon: <AiTwotoneFolderOpen className='mr-2 h-5 w-5' aria-hidden='true' />,
      onClick: () => navigate(`/task/${task._id}`),
    },
    {
      label: "Edit",
      icon: <MdOutlineEdit className='mr-2 h-5 w-5' aria-hidden='true' />,
      onClick: () => setOpenEdit(true),
    },
    // {
    //   label: "Add Sub-Task",
    //   icon: <MdAdd className='mr-2 h-5 w-5' aria-hidden='true' />,
    //   onClick: () => setOpen(true),
    // },
    {
      label: "Duplicate",
      icon: <HiDuplicate className='mr-2 h-5 w-5' aria-hidden='true' />,
      onClick: () => duplicateHanlder(task),
    },
  ];

  return (
    <>
      <div>
        <Menu as='div' className='relative inline-block text-left'>
          <Menu.Button className='inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-600 '>
            <BsThreeDots />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
          >
            <Menu.Items className='absolute p-4 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none'>
              <div className='px-1 py-1 space-y-2'>
                {items.slice(0, user.isAdmin ? 3 : user.isUstadz ? 2 : 1).map((el) => (
                  <Menu.Item key={el.label}>
                    {({ active }) => (
                      <button
                        onClick={el?.onClick}
                        className={`${
                          active ? "bg-blue-500 text-white" : "text-gray-900"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        {el.icon}
                        {el.label}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>

              <div className='px-1 py-1'>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => deleteClicks(task._id)}
                      className={`${
                        active ? "bg-blue-500 text-white" : "text-red-900"
                      } group ${user.isAdmin ? "flex" : "hidden"} w-full items-center rounded-md px-2 py-2 text-sm `}
                    >
                      <RiDeleteBin6Line
                        className='mr-2 h-5 w-5 text-red-400'
                        aria-hidden='true'
                      />
                      Delete
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      <AddTask
        open={openEdit}
        setOpen={setOpenEdit}
        task={task}
        key={new Date().getTime()}
      />

      <AddSubTask open={open} setOpen={setOpen} />

      <ConfirmationDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />
    </>
  )
}

export default TaskDialog