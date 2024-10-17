import React from 'react';
import ModalWrapper from './ModalWrapper';
import { RiDeleteBack2Fill, RiLoginCircleLine } from 'react-icons/ri';
import { FiLogOut } from 'react-icons/fi';
import { IoCreateOutline } from 'react-icons/io5';
import { GrDocumentUpdate } from 'react-icons/gr';
import { HiOutlineDocumentDuplicate } from 'react-icons/hi';

const DetailsLog = ({ open, setOpen, text, theme }) => {
  const ICONS = {
    login: <RiLoginCircleLine className="text-blue-600" />,
    delete: <RiDeleteBack2Fill className="text-red-900" />,
    logout: <FiLogOut className="text-red-600" />,
    create: <IoCreateOutline className="text-cyan-400" />,
    update: <GrDocumentUpdate className="text-green-600" />,
    duplicate: <HiOutlineDocumentDuplicate className="text-yellow-600" />,
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <div className={`flex flex-col relative ${theme?.darkMode ? 'text-white' : ''}`}>
        <div className="flex items-center gap-1 ">
          <span className={`text-xl mb-9 line-clamp-1 uppercase`}>{ICONS[text?.type]}</span>
          <span className={`text-lg mb-8 line-clamp-1 uppercase`}>{text?.type}</span>
        </div>
        <p className="text-[1rem]">{text?.textLog || 'Ada Sesuatu yang salah dalam surat ini, silahkan hubungi admin'}</p>
        <div className="mt-7 flex flex-row-reverse justify-between items-center">
          <p className="text-[1rem]">{text?.textLogDate || '00-00-0000'}</p>
          <button className=" bg-red-500 text-white sm:w-[2.5rem] h-[2rem] absolute -top-6 -right-6 w-[3rem] outline-none flex items-center justify-center" onClick={() => setOpen(false)}>
            X
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default DetailsLog;
