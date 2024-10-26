import React, { useState } from 'react';
import { Menu } from '@headlessui/react';
import { ShowMenu, Button } from '.';
import { VscSettings } from 'react-icons/vsc';
import { FilteringState } from '../utils/icons';
import { useSelector } from 'react-redux';
import { MdDone } from 'react-icons/md';
import { FaNewspaper } from 'react-icons/fa';

const Filtering = ({ arrayItem, setArrayItem }) => {
  const { theme } = useSelector((state) => state.auth);
  const handleClick = (e, name) => {
    e.preventDefault();
    setArrayItem((prev) => {
      if (prev.some((item) => item == name)) {
        return arrayItem.filter((item) => item !== name);
      } else {
        return [...prev, name];
      }
    });
  };

  const handleAll = (e) => {
    e.preventDefault();
    setArrayItem((prev) => {
      if (prev.length > 0) {
        return [];
      } else {
        return ['normal','timer','expired','blink'];
      }
    });
  };

  const handleSubmit = (e) => {
    localStorage.setItem('filteringData', JSON.stringify(arrayItem));
    window.location.reload();
  }


  return (
    <div className="">
      <ShowMenu
        icon={
          // <div className="ml-auto">
          <Button
            label="Filter"
            icon={<VscSettings className="text-lg" />}
            className={`border-[1px] rounded w-[6rem] flex flex-row-reverse justify-between ml-auto items-center font-semibold shadow-md shadow-gray-500 text-md ${
              theme.darkMode ? 'bg-gray-900 text-white' : 'bg-gray-300 border-gray-500 text-black'
            }`}
          />
          // </div>
        }
        theme={theme}
        custom={'flex flex-col text-gray-800 ml-auto'}
      >
        <div className="px-1 py-1 space-y-2 ">
          <Menu.Item>
            <button
              onClick={(e) => handleAll(e)}
              className={`group gap-5 flex w-full items-center rounded-md px-2 py-2 text-sm`}
            >
              <FaNewspaper className="text-xl" />
              {'All'}
              {arrayItem?.length == 4  && (
                <span className="ml-auto text-xl">
                  <MdDone />
                </span>
              )}
            </button>
          </Menu.Item>
        </div>
        {FilteringState.map((el) => (
          <div key={el.name} className="px-1 py-1 space-y-2">
            <Menu.Item>
              {({ active }) => (
                <button onClick={(e) => handleClick(e, el.name.toLowerCase())} className={`${active ? 'bg-blue-500 text-neutral-100' : ''} group gap-5 flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                  {el.image}
                  {el.name}
                  {arrayItem.some((item) => item == el.name.toLowerCase()) && (
                    <span className="ml-auto text-xl">
                      <MdDone />
                    </span>
                  )}
                </button>
              )}
            </Menu.Item>
          </div>
        ))}
        <Button onClick={handleSubmit} label={'submit'} className={`w-full capitalize hover:bg-green-500 mt-3 shadow-md shadow-gray-300 text-white bg-black`} />
      </ShowMenu>
    </div>
  );
};

export default Filtering;
