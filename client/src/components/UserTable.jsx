import React from 'react';
import { getInitials } from '../utils';
import moment from 'moment';
import UserInfo from './UserInfo';
import { useSelector } from 'react-redux';

const UserTable = ({ users }) => {
  const {theme} = useSelector(state => state.auth)
  const TableHeader = () => (
    <thead className={`${theme.darkMode ? 'border-b border-white text-white' : 'border-b text-black border-gray-600'}`}>
      <tr className="text-left">
        <th className="py-2 pl-3">User</th>
        <th className="py-2">Status</th>
        <th className="py-2 ml-2">
          <div className="ml-3 pl-2">Created At</div>
        </th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    <tr className={`seamlessly ${theme.darkMode ? ' border-b border-white  text-white hover:bg-gray-400/20' : 'border-b border-gray-500  text-gray-600 hover:bg-gray-400/100'} ${user.isAdmin ? `${theme.darkMode ? 'bg-yellow-600' : 'bg-yellow-200'}` : user.isUstadz ? 'bg-blue-500/20' : ''}`}>
      <td className="py-2 px-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-violet-600 mr-7 relative">
            <img src={user?.image} className={`w-full h-full rounded-full border-2 border-gray-100 object-cover absolute ${user?.image.length > 1 ? '' : 'hidden'}`} alt="" />
            <UserInfo user={user} khusus={'khusus'}  />
          </div>
          {/* {window.innerWidth < 1212 ? <span className=''>{user?.name}</span> : null} */}
        </div>
      </td>

      <td>
        <p className={`w-fit px-3 py-1 rounded-full text-sm text-white ${user?.isActive ? 'bg-blue-500' : 'bg-red-500'}`}>{user?.isActive ? 'Active' : 'Disabled'}</p>
      </td>
      <td className="py-2 text-sm">
        <div className="ml-3 pl-2">{moment(user?.createdAt).fromNow()}</div>
      </td>
    </tr>
  );
  return (
    <div className={`lg:w-1/3 seamlessly sm:w-full ${theme.darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}  px-2 md:px-3 pt-2 shadow-md rounded h-[510px] relative`}>
      <div className="h-[90%] overflow-y-auto">
        <table className="w-full">
          <TableHeader />
          <tbody className="">
            {users?.map((user, index) => (
              <TableRow key={index + user?._id} user={user} />
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-start justify-around mr-2 mt-2 h-[10%]">
        <div className="flex items-center justify-center gap-1">
          <div className={`w-4 h-4 ${theme.darkMode ? 'bg-yellow-600' : 'bg-yellow-200'}`}></div>
          <p className="text-sm mt-1">Admin</p>
        </div>
        <div className="flex items-center justify-center gap-1">
          <div className="w-4 h-4 bg-blue-500/20"></div>
          <p className="text-sm mt-1">Ustadz</p>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
