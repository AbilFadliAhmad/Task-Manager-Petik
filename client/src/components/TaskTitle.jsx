import React from 'react'
import { IoMdAdd } from 'react-icons/io'

const TaskTitle = ({className, label}) => {
  return (
    <div className='w-full h-10 md:h-12 px-2 md:px-4 rounded bg-gray-100 flex items-center justify-between border'>
        <div className="flex gap-2 items-center">
            <div className={`w-4 h-4 rounded-full ${className}`}></div>
            <p className='text-sm md:text-base text-gray-600'>{label}</p>
        </div>

        <button className="hidden">
            <IoMdAdd className='text-lg text-black' />
        </button>
    </div>
  )
}

export default TaskTitle