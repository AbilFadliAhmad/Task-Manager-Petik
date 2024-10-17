import React from 'react'
import { IoMdAdd } from 'react-icons/io'
import { useSelector } from 'react-redux'

const TaskTitle = ({className, label}) => {
  const {theme} = useSelector(state => state.auth)
  return (
    <div className={`w-full h-10 md:h-12 px-2 md:px-4 rounded ${theme.darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 border'}  flex items-center justify-between`}>
        <div className="flex gap-2 items-center">
            <div className={`w-4 h-4 rounded-full ${className}`}></div>
            <p className='text-sm md:text-base '>{label}</p>
        </div>

        <button className="hidden">
            <IoMdAdd className='text-lg text-black' />
        </button>
    </div>
  )
}

export default TaskTitle