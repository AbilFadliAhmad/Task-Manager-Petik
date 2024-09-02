import React from 'react';
import clsx from 'clsx';

// const Textbox = React.forwardRef(({ className, type, placeholder, label, register, error, name }, ref) => {
//   return (
//     <div className="w-full flex flex-col gap-1">
//       {label && <label htmlFor={name} className="text-slate-800">{label}</label>}

//       <div>
//         <input 
//             type={type} 
//             name={name} 
//             placeholder={placeholder} 
//             ref={ref} 
//             {...register} 
//             aria-invalid={error ? 'true' : 'false'} 
//             className={clsx("bg-transparent px-3 py-2.5 2xl:py-3 border border-gray-300 placeholder-gray-400 text-gray-900 outline-none text-base focus:ring-2 ring-blue-300", className)}
//         />
//       </div>
//       {error && (
//         <span className='text-xs text-red-500 mt-0.5'>
//             {error}
//         </span>
//       )}
//     </div>
//   );
// });

const Textbox = ({type, name, placeholder, register, error, className, label, status})=>{
  const value = status ? status : null
    return (
        <div className="w-full flex flex-col gap-1">
        {label && <label htmlFor={name} className="text-slate-800">{label}</label>}
  
        <div>
          <input 
              type={type} 
              name={name} 
              placeholder={placeholder} 
              {...register} 
              disabled={value == null ? false : value.isAdmin  ? false : true}
              aria-invalid={error ? 'true' : 'false'} 
              className={clsx("bg-transparent px-3 py-2.5 2xl:py-3 border border-gray-300 placeholder-gray-400 text-gray-900 outline-none text-base focus:ring-2 ring-blue-300 disabled:cursor-not-allowed", className)}
              autoFocus={type === 'email'}
              
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
