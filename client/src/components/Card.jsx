import React from 'react'

const Card = ({ icon, bg, label, count}) => {
  return (
    <div className='w-full h-32 bg-gray-100 p-5 shadow-md rounded-md flex items-center justify-between'>
        <div className='h-full flex flex-1 flex-col justify-between'>
            <p className='text-base text-gray-600'>{label}</p>
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