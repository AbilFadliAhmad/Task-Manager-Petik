import React, { useState } from 'react';
import { act_types } from '../utils';
import { MdOutlineDoneAll, MdOutlineMessage } from 'react-icons/md';
import { FaBug, FaThumbsUp, FaUser } from 'react-icons/fa';
import { GrInProgress } from 'react-icons/gr';
import moment from 'moment';
import {Loading, Button} from '../components'
import { usePostActivityMutation } from '../redux/slices/TaskApiSlice';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useUpdateStageTaskMutation } from '../redux/slices/TaskApiSlice';

const TASKTYPEICON = {
  commented: (
    <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white">
      <MdOutlineMessage />,
    </div>
  ),
  started: (
    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white">
      <FaThumbsUp size={20} />
    </div>
  ),
  assigned: (
    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-500 text-white">
      <FaUser size={14} />
    </div>
  ),
  bug: (
    <div className="text-red-600">
      <FaBug size={24} />
    </div>
  ),
  completed: (
    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white">
      <MdOutlineDoneAll size={24} />
    </div>
  ),
  'in progress': (
    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-600 text-white">
      <GrInProgress size={16} />
    </div>
  ),
};



const Activities = ({ activity, id, stage }) => {
  const [updateStage] = useUpdateStageTaskMutation();
  const { user } = useSelector((state) => state.auth);
  const {id:taskId} = useParams()
  const [postData, { isLoading:Loading }] = usePostActivityMutation()
  const [selected, setSelected] = useState(act_types[0]);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  let toastD;
  
  const handleSubmit = async()=>{
    try {
      if(text == '') return toast.error('Text Tidak Boleh Kosong')
      setIsLoading('oke gan')
      toastD = toast.loading('Sedang mencoba menambahkan data...')
      const data = {activity:String(text), type:String(selected), id:String(taskId)}
      if(data.type.toLocaleLowerCase() !== 'assigned' && data.type.toLocaleLowerCase() !== 'completed' && stage !== 'in progress') {
        await handleStage('in progress')
      } else if( data.type.toLowerCase() === 'completed' && stage !== 'completed') {
        await handleStage('completed', true)
      } else if( data.type.toLowerCase() === 'assigned' && stage !== 'todo') {
        await handleStage('todo')
      }
      await postData(data).unwrap()
      .then(()=>setIsLoading(false))
      .then(()=>setTimeout(() => {
        window.location.reload()
      }, 1800))
      .then(()=>toast.dismiss(toastD))
      .then(()=>toast.success("Activity Berhasil Ditambahkan"))
    } catch (error) {
      toast.dismiss(toastD)
      setIsLoading(false)
      console.log(error, 'error');
      toast.error('Failed to post activity')
    }
  }

  const handleStage = async(stage, condition)=>{
    try {
      await updateStage({id, stage, timer:condition ? false : true, batas: condition ? '78893280' : []}).unwrap()
    } catch (error) {
      console.log(error)
      toast.error(error?.data?.message || error.message)
    }
  }
  const Card = ({ item, isConnected }) => {
    return (
      <div className='flex space-x-4'>
        <div className='flex flex-col items-center flex-shrink-0'>
          <div className='w-10 h-10 flex items-center justify-center'>
            {TASKTYPEICON[item?.type]}
          </div>
          <div className='w-full h-full flex items-center my-2 justify-center'>
            <div className={`w-0.5 bg-black h-full  ${isConnected ? '' : 'hidden'}`}></div>
          </div>
        </div>

        <div className='flex flex-col gap-y-1 mb-8'>
          <p className='font-semibold'>{item?.by?.name}</p>
          <div className='text-gray-500 space-y-2'>
            <span className='capitalize'>{item?.type} </span>
            <span className='text-sm'>{moment(item?.date).fromNow()}</span>
          </div>
          <div className='text-gray-700'>{item?.activity}</div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="w-full flex gap-10 2xl:gap-20 min-h-screen px-10 py-8 bg-gray-100 shadow rounded-md justify-between overflow-y-auto">
      <div className="w-full md:w-1/2">
        <h4 className="text-gray-600 font-semibold text-lg mb-5">Activities</h4>

        <div className="w-full">
          {activity?.map((el, index) => (
              <Card key={index} item={el} isConnected={index < activity?.length - 1} />
          ))}
        </div>
      </div>
      <div className='w-full md:w-1/3'>
      <h4 className="text-gray-600 font-semibold text-lg mb-5">Add Activity</h4>
        <div className="w-full flex flex-wrap gap-5">
          {act_types.slice(user?.isAdmin || user.isUstadz ? 0 : 1, user.isAdmin || user.isUstadz ? 6 : 5).map((item, index) => (
            <div
              key={item}
              className="flex gap-2 items-center"
            >
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={selected === item ? true : false}
                onChange={(e) => setSelected(item)}
                id={item}
              />
              <label htmlFor={item}>{item}</label>
            </div>
          ))}
          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type ......"
            className="bg-white w-full mt-10 border border-gray-300 outline-none p-4 rounded-md focus:ring-2 ring-green-500"
          ></textarea>
            <Button
              type="button"
              label="Submit"
              onClick={handleSubmit}
              className="bg-blue-600 text-white rounded-md w-[10rem]"
            />
        </div>
      </div>
    </div>
  );
};

export default Activities;
