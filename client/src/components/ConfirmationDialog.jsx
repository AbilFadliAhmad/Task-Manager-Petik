import { Dialog } from '@headlessui/react';
import clsx from 'clsx';
import { FaQuestion } from 'react-icons/fa';
import ModalWrapper from './ModalWrapper';
import Button from './Button';
import { useSelector } from 'react-redux';

export default function ConfirmationDialog({ open, setOpen, msg, setMsg = () => {}, onClick = () => {}, type = 'delete', setType = () => {} }) {
  const {theme} = useSelector(state => state.auth)
  const closeDialog = () => {
    setOpen(false);
    setTimeout(() => {
      setType('delete');
      setMsg(null);
    }, 200);

  };

  return (
    <>
      <ModalWrapper open={open} setOpen={closeDialog}>
        <div className="py-4 w-full flex flex-col gap-4 items-center justify-center">
          <Dialog.Title as="h3" className="">
            <p className={clsx('p-3 rounded-full ', type === 'restore' || type === 'restoreAll' ? `text-yellow-600 ${theme.darkMode ?  'bg-yellow-800' : 'bg-yellow-200'}` : `text-red-600 ${theme.darkMode ? 'bg-red-900' : 'bg-red-200'}`)}>
              <FaQuestion size={60} />
            </p>
          </Dialog.Title>

          <p className={`text-center ${theme.darkMode ? 'text-white' : 'text-gray-500'}`}>{msg ?? 'Are you sure you want to delete the selected record?'}</p>

          <div className={`${theme.darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-3 sm:flex sm:flex-row-reverse gap-4`}>
            <Button
              type="button"
              className={clsx(' px-8 text-sm font-semibold text-white sm:w-auto', type === 'restore' || type === 'restoreAll' ? 'bg-yellow-600' : 'bg-red-600 hover:bg-red-500')}
              onClick={onClick}
              label={type === 'restore' ? 'Restore' : 'Delete'}
            />

            <Button type="button" className="bg-white px-8 text-sm font-semibold text-gray-900 sm:w-auto border" onClick={() => closeDialog()} label="Cancel" />
          </div>
        </div>
      </ModalWrapper>
    </>
  );
}

export function UserAction({ open, setOpen, onClick = () => {}, status, theme, isLoading }) {
  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={closeDialog}>
        <div className="py-4 w-full flex flex-col gap-4 items-center justify-center">
          <Dialog.Title as="h3" className="">
            <p className={clsx('p-3 rounded-full ', `text-red-600 ${theme.darkMode ? 'bg-red-900' : 'bg-red-200'}`)}>
              <FaQuestion size={60} />
            </p>
          </Dialog.Title>

          <p className={`text-center ${theme.darkMode ? 'text-white' : 'text-gray-500'}`}>{`Apakah kamu yakin ingin ${status ? 'Menonaktifkan' : 'Mengaktifkan'} akun ini?`}</p>

          <div className={`${theme.darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-3 sm:flex sm:flex-row-reverse gap-4`}>
            <Button isLoading={isLoading || false} type="button" className={clsx(' px-8 text-sm font-semibold text-white sm:w-auto', 'bg-red-600 hover:bg-red-500')} onClick={onClick} label={'Yes'} />

            <Button type="button" className="bg-white px-8 text-sm font-semibold text-gray-900 sm:w-auto border" onClick={() => closeDialog()} label="No" />
          </div>
        </div>
      </ModalWrapper>
    </>
  );
}
