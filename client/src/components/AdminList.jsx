import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react';
import React, { useState, Fragment, useEffect } from 'react';
import { summary } from '../assets/data';
import { BsChevronExpand } from 'react-icons/bs';
import { MdCheck } from 'react-icons/md';
import { getInitials } from '../utils';
import clsx from 'clsx';
import { useListQuery } from '../redux/slices/ActionApiSlice';
import Loading from './Loading';
import { FaRegCircleUser } from 'react-icons/fa6';
import { useSelector } from 'react-redux';

const AdminList = ({ leader, setLeader, theme }) => {
  // const data = summary.users;
  const { data, isLoading } = useListQuery();
  const [admin, setAdmin] = useState([]);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    setAdmin(data?.users.filter((user) => user.isAdmin == true || user.isUstadz == true));
  }, [data, isLoading]);
  const [selectedAdmin, setSelectedAdmin] = useState([]);

  const onCheck = (e) => {
    if (selectedAdmin.length > 0) {
      const confirm = window.confirm('Apakah kamu yakin ingin mengganti pemimpin tugas ini?');
      if (!confirm) {
        e.preventDefault();
        return;
      }
      setLeader([]);
      setSelectedAdmin([]);
    }
  };

  const handleChange = async (e) => {
    await setSelectedAdmin(e);
    await setLeader(e.map((el) => el._id));
    if (selectedAdmin?.length > 2) {
      alert('Tidak boleh lebih dari 3 pemimpin');
      setSelectedAdmin([]);
      setLeader([]);
    }
  };

  useEffect(() => {
    if (leader.length > 0) {
      setSelectedAdmin(leader);
    }
  }, []);

  return isLoading ? (
    <Loading />
  ) : (
    <div className="w-[3.5rem] border-r-[3px]">
      <Listbox value={selectedAdmin} onChange={handleChange} className="h-full " multiple>
        <div className="">
          <div className={`h-full flex justify-center items-center flex-wrap ${leader.length > 0 ? '' : 'hidden'}`}>
            {leader.length > 0
              ? selectedAdmin.map((admin, index) =>
                  admin.image ? (
                    <img key={index} src={admin.image} alt="" className={`${leader.length == 1 ? 'w-8 h-8' : leader.length == 2 ? 'w-6 h-6' : 'w-4 h-4'} rounded-full border border-black`} />
                  ) : (
                    <div key={index} className={`${leader.length == 1 ? 'w-8 h-8' : leader.length == 2 ? 'w-6 h-6' : 'w-4 h-4'} rounded-full border bg-purple-500 text-white flex items-center justify-center`}>
                      <span>{getInitials(admin.name)}</span>
                    </div>
                  )
                )
              : null}
          </div>
          <ListboxButton disabled={user.isAdmin ? false : true} className={'relative w-full cursor-default rounded rounded-r-none  pl-3 pr-10 text-left px-3 py-2.5 2xl:py-3 sm:text-sm h-full disabled:cursor-not-allowed'} onClick={onCheck}>
            <span>{leader.length > 0 ? <FaRegCircleUser className="w-14 h-14 absolute right-0 -top-12 opacity-0" /> : <FaRegCircleUser className={`w-8 h-8 ${theme?.darkMode ? 'text-white' : ''}`} />}</span>
          </ListboxButton>
          <ListboxOptions
            className={`z-50 absolute ${
              leader?.length == 0 ? 'mt-1' : leader?.length == 1 ? '-mt-12' : '-mt-10'
            }  max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm overflow-y-auto w-[70%] border-2 border-gray-800/4`}
          >
            {admin?.map((user, index) => (
              <ListboxOption
                key={index}
                value={user}
                className={({ active, selected }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-500'} ${selected ? 'text-red-900' : ''} `}
              >
                {({ selected }) => (
                  <div>
                    <div className={clsx('flex items-center gap-2  truncate', selected ? 'font-medium' : 'font-normal')}>
                      <div className="w-6 h-6 rounded-full text-white flex items-center justify-center bg-violet-600">
                        {user?.image?.length > 1 ? (
                          <img className="w-full h-full rounded-full border-2 border-gray-300 shadow-md object-cover" src={user?.image} alt="" />
                        ) : (
                          <span className="text-center text-[10px]">{getInitials(user.name)}</span>
                        )}
                      </div>
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

export default AdminList;
