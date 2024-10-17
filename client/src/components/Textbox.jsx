import React, { useState } from 'react';
import clsx from 'clsx';

const Textbox = ({type, name, placeholder, register, error, className, label, status, limit, min, max, theme})=>{
  const value = status ? status : null
  const [valueInput, setValueInput] = useState(1)
  const handleChange = (e) => {
    const {value} = e.target
    if(limit && Number(valueInput) < min || Number(valueInput) >= max) return setValueInput(valueInput.splice(valueInput.length - 1, 1))
    setValueInput(value)

  }
    return (
        <div className="w-full flex flex-col gap-1">
        {label && <label htmlFor={name} className={`${theme?.darkMode ? 'text-white' : ' text-slate-800'}`}>{label}</label>}
  
        <div className='text-white'>
          <input 
              type={type} 
              name={name} 
              placeholder={placeholder} 
              {...register} 
              disabled={value == null ? false : value.isAdmin  ? false : true}
              aria-invalid={error ? 'true' : 'false'} 
              className={clsx("bg-transparent px-3 py-2.5 2xl:py-3 border border-gray-300 placeholder-gray-400 text-gray-900 outline-none text-base focus:ring-2 ring-blue-300 disabled:cursor-not-allowed", className, `${theme?.darkMode ? 'text-white placeholder:text-neutral-300' : ''}`)}
              autoFocus={type === 'email'}
              {...(limit ? { min:min, max:max, onChange:handleChange, value:valueInput } : {})}
          />
        </div>
        {error && (
          <span className='text-xs text-red-500 mt-0.5'>
              {error}
          </span>
        )}
      </div>
    )
}
export default Textbox;
