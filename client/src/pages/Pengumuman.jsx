import React from 'react';
import { Button, Textbox, Title } from '../components';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { useSelector } from 'react-redux';
import { useDropdownQuery } from '../redux/slices/ActionApiSlice';
import { MdCheck } from 'react-icons/md';
import { getInitials } from '../utils';
import clsx from 'clsx';
import { useSendNotificationMutation } from '../redux/slices/NotificationApiSlice';
import toast from 'react-hot-toast';

const Pengumuman = () => {
  const [check, setCheck] = React.useState('Semua');
  const [selectedMember, setSelectedMember] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const { user: pengguna } = useSelector((state) => state.auth);
  const { data, isLoading, refetch } = useDropdownQuery();
  const [input, setInput] = React.useState('');
  const [ sendNotification, { isLoading: isLoadingSend } ] = useSendNotificationMutation();
  const [loading, setLoading] = React.useState(false)

  const handleCheckbox = (e) => {
    setCheck(e.target.value);
  };

  const handleChange = (e) => {
    setSelectedMember(e);
  };


  const handleKirim = async()=>{
    try {
      let i;
      if(check == 'Custom') {
        setLoading(true)
        i = toast.loading('Sedang mengirim...')
        await sendNotification({users:selectedMember, isi:input}).unwrap()
        toast.dismiss(i)
        toast.success('Kamu berhasil')
        setLoading(false)
        setTimeout(() => {
          window.location.reload()
        }, 1500);
      } else {
        setLoading(true)
        i = toast.loading('Sedang mengirim...')
        await sendNotification({users:users, isi:input}).unwrap()
        setTimeout(() => {
          window.location.reload()
        }, 1500);
        setLoading(false)
        toast.dismiss(i)
        toast.success('Kamu juga berhasil')
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
      toast.dismiss(i)
      toast.error(error?.data?.message || error.message)
    }
  }

  React.useEffect(() => {
    if (!isLoading) {
      data && setUsers(data?.users);
    }
  }, [data, isLoading]);

  return (
    <div className='mx-4'>
      <div className="w-full h-fit pb-5">
        <div className="flex items-center justify-between mb-8 my-4 mx-4">
          <Title title="Papan Pengumuman" className={'text-lg md:text-2xl'} />
          <Button className={'flex invisible flex-row-reverse gap-1 items-center bg-blue-500 text-white text-sm sm:text-lg w-[9rem] sm:w-[10.32rem]'} label={'Add New User'} />
        </div>
        <div className="bg-gray-100 flex flex-col mx-4 my-2  pt-4 items-center min-h-[90%] h-fit gap-3 rounded-xl">
          <h1 className="sm:text-2xl text-[1rem]">ORANG YANG INGIN DITUJU</h1>
          <div className="flex gap-6 justify-around">
            <div className="flex items-center justify-center gap-1">
              <span onClick={() => setCheck('Semua')} className={`w-3 h-3 cursor-pointer rounded-full border border-black  ${check == 'Semua' ? 'bg-red-600' : 'bg-white'}`}></span>
              <input type={'checkbox'} id="Semua" value="Semua" className="w-5 h-5 hidden  checked:bg-red-900" checked={check === 'Semua'} onChange={handleCheckbox} />
              <label htmlFor="Semua">Semua</label>
            </div>
            <div className="flex items-center justify-center gap-1 ">
              <span onClick={() => setCheck('Custom')} className={`w-3 h-3 cursor-pointer rounded-full border border-black  ${check == 'Custom' ? 'bg-red-600' : 'bg-white'}`}></span>
              <input type={'checkbox'} id="Custom" value="Custom" className="w-5 h-5 hidden" checked={check === 'Custom'} onChange={handleCheckbox} />
              <label htmlFor="Custom">Custom</label>
            </div>
          </div>

          <div>
            <Listbox value={selectedMember} onChange={handleChange} multiple className="relative left-4">
              <div className="">
                <ListboxButton disabled={check == 'Custom' ? false : true} className={'w-full cursor-pointer pl-3 pr-10 text-left px-3 py-2.5 2xl:py-3 sm:text-sm overflow-auto disabled:cursor-not-allowed'}>
                  <div className={`bg-blue-500 px-8 py-2 rounded ${check == 'Semua' ? 'opacity-70' : ''}`}>
                    <h1 className="text-sm text-white">{check == 'Semua' ? 'Semua' : 'Custom'}</h1>
                  </div>
                </ListboxButton>
                <ListboxOptions className="z-50 absolute left-1/2  -translate-x-1/2  mt-2 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm border-2 border-gray-800/4 w-[190%]">
                  {users?.map((user, index) => (
                    <ListboxOption
                      key={index}
                      value={user}
                      className={({ active, selected }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-300 text-amber-900' : 'text-gray-500'} ${selected ? 'text-red-900' : ''} ${user.isAdmin ? 'bg-yellow-200' : user.isUstadz ? 'bg-blue-500/20' : ''} `}
                    >
                      {({ selected }) => (
                        <div>
                          <div className={clsx('flex items-center gap-2  truncate', selected ? 'font-medium' : 'font-normal')}>
                            {user?.image?.length > 1 ? (
                              <div className="w-7 h-7 rounded-full text-white flex items-center justify-center">
                                <img src={user?.image} alt={user?.name} className="w-full h-full object-cover rounded-full" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full text-white flex items-center justify-center bg-violet-600">
                                <span className="text-center text-[10px]">{getInitials(user.name)}</span>
                              </div>
                            )}

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
          <div className="flex flex-col items-center justify-center w-full mb-6">
            <textarea
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-[15rem] sm:w-[20rem] placeholder:text-sm sm:placeholder:text-lg px-4 min-h-[100px] h-[250px] text-lg border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-black py-2 "
              placeholder="Tulis Pesannya disini..."
            />
            <Button label={'Kirim'} className={'w-[15rem] text-white sm:w-[20rem] mt-3 bg-blue-500'} onClick={handleKirim} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pengumuman;
