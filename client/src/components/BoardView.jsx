import React from 'react';
import { TaskCard } from '.';
import { useLocation } from 'react-router-dom';
const BoardView = ({ tasks, awalItem, item }) => {
  const location = String(useLocation().pathname.split('/')[1].replace('-', ' '))
  const filterTasks = location == 'timer' || location == 'expired' || location == 'blink' ? tasks : tasks?.filter(task=>location == 'tasks' || task.stage == location)
  return (
    <div className="w-full py-4 grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-4 gap-x-10 2xl:gap-10">
      {filterTasks?.slice(0, item).map((task, index) => (
      //  {filterTasks?.map((task, index) => (
        <TaskCard task={task} key={index} />
      ))}
    </div>
  );
};

export default BoardView;
