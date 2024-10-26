import { BiSolidTimer } from 'react-icons/bi';
import { GoFileDirectoryFill } from "react-icons/go";
import { IoTimer } from 'react-icons/io5';
import { MdTimerOff } from 'react-icons/md';

export const FilteringState = [
    // {
    //   name: 'All',
    //   image: <FaNewspaper className='text-xl' />,
    // },
    {
      name: 'Normal',
      image: <GoFileDirectoryFill className='text-xl' />,
    },
    {
      name: 'Expired',
      image: <MdTimerOff className='text-xl' />,
    },
    {
      name: 'Blink',
      image: <BiSolidTimer className='text-xl' />,
    },
    {
      name: 'Timer',
      image: <IoTimer className='text-xl' />,
    },
  ];