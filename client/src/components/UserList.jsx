import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react';
import React, { useState, Fragment, useEffect } from 'react';
import { summary } from '../assets/data';
import { BsChevronExpand } from 'react-icons/bs';
import { MdCheck } from 'react-icons/md';
import { getInitials } from '../utils';
import clsx from 'clsx';
import { useDropdownQuery, useListQuery } from '../redux/slices/ActionApiSlice';
import Loading from './Loading';
import { FaRegCircleUser } from 'react-icons/fa6';
import { useSelector } from 'react-redux';

const UserList = ({ team, setTeam, leader, theme }) => {
  const {user:pengguna} = useSelector(state=>state.auth)
  const { data, isLoading } = useDropdownQuery();
  const [users, setUsers] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState([]);
  useEffect( () => {
    setSelectedAdmin(team)
    const leader1 = leader[0]?._id ?? undefined
    const leader2 = leader[1]?._id ?? undefined
    const leader3 = leader[2]?._id ?? undefined
    if(leader3 == pengguna._id || leader2 == pengguna._id || leader1 == pengguna._id) {
      setUsers(data?.users?.filter(user=> user.leader == leader3 || user.leader == leader2 || user.leader == leader1 && user.isUstadz == false) );
    } 
  }, [data,isLoading])
  const onCheck = (e)=>{
    if(selectedAdmin.length > 0) {
      const confirm = window.confirm("Apakah kamu yakin ingin mengganti anggota tugas ini?")
      if(!confirm) {
        e.preventDefault()
        return;
      }
      setTeam([])
      setSelectedAdmin([])
    }
  }

  const handleChange = async(e) => {
    await setTeam(e.map(el=>el._id));
    await setSelectedAdmin(e);
  }


  return isLoading ? (
    <Loading />
  ) : (
    <div className="">
      <Listbox value={selectedAdmin} onChange={handleChange} className="relative" multiple>
        <div className=''>
        <p className={`absolute left-2 top-4 ${theme?.darkMode ? 'text-white' : 'text-gray-500'}  ${selectedAdmin.length > 0 ? 'hidden' : ''}`}>Member...</p>
          <ListboxButton disabled={pengguna.isAdmin ? true : false} className={'w-full cursor-pointer pl-3 pr-10 text-left px-3 py-2.5 2xl:py-3 sm:text-sm overflow-auto disabled:cursor-not-allowed'} onClick={onCheck}>
            <p className='text-sm'>
              {selectedAdmin.length > 0 ? selectedAdmin.map(item=>item.name).join(', ') : <FaRegCircleUser className='w-full h-full pr-[20rem] pb-4 invisible' />}
            </p>
          </ListboxButton>
          <ListboxOptions className="z-50 absolute mt-2 max-h-60  overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm overflow-y-auto sm:w-[17rem] w-[13rem] border-2 border-gray-800/4">
            {users?.map((user, index) => (
              <ListboxOption
                key={index}
                value={user}
                className={({ active, selected }) => `relative cursor-default select-none py-2 pl-10 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-500'} ${selected ? 'text-red-900' : ''} `}
              >
                {({ selected }) => (
                  <div>
                    <div className={clsx('flex items-center gap-2 truncate', selected ? 'font-medium' : 'font-normal')}>
                      {user?.image?.length > 1 
                      ? <div className='w-7 h-7 rounded-full text-white flex items-center justify-center'>
                        <img src={user?.image} alt={user?.name} className='w-full h-full object-cover rounded-full' />
                      </div>
                    : <div className="w-6 h-6 rounded-full text-white flex items-center justify-center bg-violet-600">
                    <span className="text-center text-[10px]">{getInitials(user.name)}</span>
                  </div>}
                      
                      <span>{user.name}</span>
                    </div>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                        <MdCheck className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </div>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
};

export default UserList;
