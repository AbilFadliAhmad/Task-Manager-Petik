import { Popover, Transition } from '@headlessui/react';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { BiSolidMessageRounded } from 'react-icons/bi';
import { HiBellAlert } from 'react-icons/hi2';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { Link } from 'react-router-dom';
import ViewNotification from './ViewNotification';
import { useGetNotifQuery, useMarkNotifMutation } from '../redux/slices/NotificationApiSlice';
import { toast } from 'react-hot-toast';
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { useSelector } from 'react-redux';

const NotificationPanel = () => {

  const ICONS = {
    alert: <HiBellAlert className="h-5 w-5 text-gray-600 group-hover:text-indigo-600" />,
    message: <BiSolidMessageRounded className="h-5 w-5 text-gray-600 group-hover:text-indigo-600" />,
  };

  const {user, theme} = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const {data, isLoading, refetch} = useGetNotifQuery();
  const [mark, {isLoading:Loading}] = useMarkNotifMutation();
  const [seen, setSeen] = useState(false);

  
  useEffect(() => {
    if(!isLoading && data?.notification?.length > 0) {
      const condition = data?.notification.filter(item=>!item.isSeen.includes(user?._id)).length
      console.log(condition, 'condition')
      if(condition > 0 && !seen) {

        toast.custom((t) => (
          <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gray-600/10 shadow-lg">
                  <MdOutlineMarkEmailUnread className="h-6 w-6 rounded-full text-red-700"  />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Pesan Masuk
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Kamu Punya {data?.notification?.length ?? 0} Pesan yang belum dibaca
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => handleClose(t)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600  focus:outline-none focus:ring-2 hover:text-red-600"
              >
              Tutup
            </button>
          </div>
        </div>
      ),{
        duration: 1000000
      })
    }
  }
  })

  const handleClose = async(t)=>{
    toast.dismiss(t.id)
    setSeen(true)
    const object = {isReadType:'seen', id:''}
    await mark(object)
  }
  const readHandler = async(count, id) => {
    try {
      await mark({isReadType:count, id})
      await refetch();
    } catch (error) {
      console.log(error);
      toast.error('ada sesuatu yang salah')
    }
  };

  const callsToAction = [
    { name: 'Close', href: '#', icon: '' },
    {
      name: 'Mark All Read',
      href: '#',
      icon: '',
      onClick: () => readHandler('all', ''),
    },
  ];

  const viewHandler = async (el) => {
    setSelected(el);
    readHandler('one', el._id);
    setOpen(true);
  };

  return (
    <>
      <Popover className="relative">
        <Popover.Button className="inline-flex items-center outline-none">
          <div className={`w-8 h-8 flex items-center justify-center relative`}>
            <IoIosNotificationsOutline className="text-2xl" />
            {data?.notification?.length > 0 && <span className="absolute text-center top-0 right-1 text-sm text-white font-semibold w-4 h-4 rounded-full bg-red-600">{data?.notification?.length}</span>}
          </div>
        </Popover.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel className="absolute -right-16 md:-right-2 z-10 mt-5 flex w-screen max-w-max px-4">
            {({ close }) =>
              data?.notification?.length > 0 && (
                <div className={`w-screen max-w-md flex-auto overflow-auto lg:max-h-[34rem] sm:max-h-[27rem] max-h-[20rem] rounded-3xl ${theme.darkMode ? 'bg-blue-950 text-white' : 'bg-white'}  text-sm leading-6 shadow-lg ring-1 ring-gray-900/5`}>
                  <div className="pl-4 pb-0 pt-2">
                    {data?.notification?.map((item, index) => (
                      <div key={item._id + index} className="group relative flex gap-x-4 rounded-lg p-4 ">
                        <div className="mt-1 h-8 w-8 flex items-center justify-center rounded-lg  group-hover:bg-white">{ICONS[item.notiType]}</div>

                        <div className="cursor-pointer w-full" onClick={() => viewHandler(item)}>
                          <div className="flex items-center gap-3 font-semibold capitalize">
                            <p> {item.notiType}</p>
                            <span className="text-xs  font-normal lowercase">{moment(item.createdAt).fromNow()}</span>
                          </div>
                          <p className={`line-clamp-1 mt-1  ${item?.task?.title ? '' : 'text-red-500'}`}>{item?.task?.title ?? 'Pengumuman...'}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={`grid grid-cols-2 divide-x ${theme.darkMode ? 'bg-blue-950 text-cyan-400' : 'bg-gray-50 text-green-600'} `}>
                    {callsToAction.map((item) => (
                      <Link key={item.name} onClick={item?.onClick ? () => item.onClick() : () => close()} className="flex items-center justify-center gap-x-2.5 p-3 font-semibold  hover:bg-gray-600/10">
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            }
          </Popover.Panel>
        </Transition>
      </Popover>
      <ViewNotification open={open} setOpen={setOpen} el={selected} />
    </>
  );
};

export default NotificationPanel;
