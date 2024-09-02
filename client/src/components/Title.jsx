import React from 'react'

const Title = ({title, className}) => {
  return (
    <h2 className={`text-2xl capitalize font-semibold ${className}`}>{title}</h2>
  )
}

export default Title