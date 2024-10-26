import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Card = ({ icon, bg, label, count, link, shadow}) => {
  const {theme} = useSelector(state => state.auth)
  const navigate = useNavigate();
  return (
    <div onClick={navigate ? () => navigate(link) : undefined} className={`w-full hover:font-extrabold shadow-md ${shadow ? shadow : ''} h-32 seamlessly ${link ? 'cursor-pointer' : ''} ${theme.darkMode ? 'bg-gray-900 text-white hover:shadow-gray-200' : 'hover:shadow-gray-900 bg-gray-100 text-gray-600'} p-5 shadow-md rounded-md flex items-center justify-between`}>
        <div className='h-full flex flex-1 flex-col justify-between'>
            <p className='text-base '>{label}</p>
            <span className='text-2xl font-bold'>{count}</span>
            <span className='text-sm text-gray-400 opacity-0'>110 Terkahir</span>
        </div>

        <div className={`w-10 h-10 flex rounded-full items-center justify-center text-white shadow-md ${shadow ? shadow : ''} ${bg}`}>
            {icon}
        </div>
    </div>
  )
}

export default Card