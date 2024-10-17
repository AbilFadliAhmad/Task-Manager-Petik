import clsx from 'clsx'
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from 'react-icons/md'
import { BGS, PRIOTITYSTYELS, TASK_TYPE } from '../utils'
import { UserInfo } from '.'
import moment from 'moment'
import { useSelector } from 'react-redux'

const TaskTable = ({tasks}) => {
  const ICONS = {
    high:<MdKeyboardDoubleArrowUp />,
    medium:<MdKeyboardArrowUp />,
    normal:<MdKeyboardArrowDown />,
  }

  const {theme} = useSelector(state => state.auth)

  const TableRow = ({task})=>(
    <tr className={`seamlessly ${theme.darkMode ? 'border-b border-white text-neutral-200 hover:bg-gray-300/20' : 'border-b border-gray-500 text-black hover:bg-gray-300/100'}`}>
      <td className='py-2 px-3'>
        <div className='flex items-center gap-2'>
          <div className={clsx('w-4 h-4 rounded-full pr-4', TASK_TYPE[task.stage])} />
          <p className='text-base'>{task.title}</p>
        </div>
      </td>
      <td className='py-2'>
        <div className='flex gap-1 items-center'>
          <span className={`text-lg ${PRIOTITYSTYELS[task.priority]}`}>{ICONS[task.priority]}</span>
          <span className='text-base capitalize'>{task.priority}</span>
        </div>
      </td>
      <td className='py-2'>
        <div className='flex gap-[0.1rem] pr-5'>
          {task?.team?.map((m, index)=> m?.image?.length > 1 ? (
            <div key={index} className={`w-5 h-5 rounded-full flex items-center justify-center text-sm -mr-1`}>
              <img src={m?.image} alt="" className='w-full h-full object-cover rounded-full relative left-6' />
              <UserInfo user={m} color={index} />
          </div>
          ) :(
            <div key={index} className={`w-5 h-5 rounded-full text-white flex items-center justify-center text-sm -mr-1 ${BGS[index % BGS.length]}`}>
              <UserInfo user={m} color={index} />
            </div>
          ))}
        </div>
      </td>
      <td className='py-2 hidden md:block'>
          <span className={`text-base ml-3 ${theme.darkMode ? 'text-gray-400/100' : 'text-gray-600'}`}>{moment(task?.date).fromNow()}</span>
      </td>
    </tr>
  )

  const TableHeadler = ()=>(
    <thead className={`${theme.darkMode ? 'border-b border-white text-white' : 'border-b text-black border-gray-500'}`}>
      <tr className='text-left'>
        <th className='py-2 px-2'>Task Title</th>
        <th className='py-2'>Priority</th>
        <th className='py-2'>Team</th>
        <th className='py-2 hidden md:block ml-3'>Created At</th>
      </tr>
    </thead>
  )

  return (
    <>
     <div className={`w-full seamlessly lg:w-2/3 ${theme.darkMode ? 'bg-gray-900' : 'bg-gray-100'}  px-2 md:px-4 pt-2 pb-4 shadow-md rounded`}>
      <table className='w-full overflow-auto'>
        <TableHeadler />
        <tbody>
          {tasks?.map((task, id)=>(
              <TableRow key={id} task={task} />
            ))}
        </tbody>
      </table>
     </div> 
    </>
  )
}

export default TaskTable