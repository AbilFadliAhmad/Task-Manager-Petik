import { useLocation } from 'react-router-dom';
import TableRow from './TableRow';
import { useSelector } from 'react-redux';


const Table = ({ tasks, awalItem, item, halaman, jumlahHalaman }) => {
  const path = String(useLocation().pathname.split('/')[1].replace('-', ' '));
  const {theme} = useSelector(state=>state.auth);
  


  const TableHeader = () => (
    <thead className={`w-full border-b seamlessly ${theme.darkMode ? 'text-white border-white' : 'text-black border-gray-300'} `}>
      <tr className="w-full text-left">
        <th className="py-2 pr-6">Task Title</th>
        <th className="py-2">Deadline</th>
        <th className="py-2">Priority</th>
        <th className="py-2 line-clamp-1">Created At</th>
        <th className="py-2">Assets</th>
        <th className="py-2">Team</th>
      </tr>
    </thead>
  );

  

  return (
    <>
      <div className={`${theme?.darkMode ? 'bg-gray-900' : 'bg-gray-100'} seamlessly px-2 md:px-4 pt-4 pb-9 shadow-md rounded w-full overflow-y-auto`}>
        <div className="">
          <table className="w-full">
            <TableHeader />
            <tbody>
              {tasks.filter(task=>path=='tasks'|| path==task.stage).slice(awalItem, awalItem + item).map((task, index) => (
                      <TableRow key={index} task={task} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </>
  );
};

export default Table;
