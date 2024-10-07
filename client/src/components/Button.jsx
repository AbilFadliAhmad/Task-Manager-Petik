import clsx from 'clsx'
import React from 'react'
// import { Icons } from 'react-toastify'

const Button = ({className, label, type, status, icon, onClick=()=>{}}) => {
  return (
    <button onClick={onClick} type={type} className={clsx('px-3 py-2 outline-none rounded-xl disabled:cursor-not-allowed', className)} disabled={status?.isAdmin}>
        <span>{label}</span>
        <span>
          {icon && icon}
        </span>
    </button>
    )
}

export default Button