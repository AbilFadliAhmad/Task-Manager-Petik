import React from 'react'
import { useSelector } from 'react-redux'

const Card = ({ icon, bg, label, count}) => {
  const {theme} = useSelector(state => state.auth)
  return (
    <div className={`w-full h-32 ${theme.darkMode ? 'bg-gray-900 text-white' : ' bg-gray-100 text-gray-600'} p-5 shadow-md rounded-md flex items-center justify-between`}>
        <div className='h-full flex flex-1 flex-col justify-between'>
            <p className='text-base '>{label}</p>
            <span className='text-2xl font-bold'>{count}</span>
            <span className='text-sm text-gray-400'>110 Terkahir</span>
        </div>

        <div className={`w-10 h-10 flex rounded-full items-center justify-center text-white ${bg}`}>
            {icon}
        </div>
    </div>
  )
}

export default Card