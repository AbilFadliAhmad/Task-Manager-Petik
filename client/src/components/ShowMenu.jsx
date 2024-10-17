import { Menu, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import { BsThreeDots } from 'react-icons/bs'

const ShowMenu = ({children, icon, custom, theme}) => {
  return (
    <>
     <div>
        <Menu as='div' className='relative inline-block text-left'>
          <Menu.Button className={`${custom ? `${custom}` : 'inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-600'}`}>
            {icon || <BsThreeDots className={`${theme.darkMode ? 'text-white' : ''}`} />}
          </Menu.Button>

          <Transition
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
          >
            <Menu.Items className={`absolute ${custom ? 'p-4 -right-30 -top-[8rem] bg-gray-500 font-bold ' : 'p-4 right-0 bg-white'}  -mt-1 w-56 origin-top-right divide-y divide-gray-100 rounded-md  shadow-lg ring-1 ring-black/5 focus:outline-none`}>
                {children}
            </Menu.Items>
          </Transition>
        </Menu>
      </div> 
    </>
  )
}

export default ShowMenu