import { Tab, TabGroup, TabList, TabPanels } from '@headlessui/react';
import { useSelector } from 'react-redux';
import Filtering from './Filtering';

const classnames = (...classes) => {
  return classes.filter(Boolean).join('');
};
const Tabs = ({ children, tabs, setSelected, path, arrayItem, setArrayItem }) => {
  const { theme } = useSelector((state) => state.auth);
  const handleClick = (index) => {
    setSelected(index);
    localStorage.setItem('selected', String(index));
  };
  const result = localStorage.getItem('selected');
  return (
    <div className="w-full px-1 sm:px-0">
      <TabGroup>
        <TabList className="flex space-x-6 rounded-xl p-1">
          {tabs.map((tab, index) => (
            <Tab
              key={index + tab.title}
              onClick={() => handleClick(index)}
              className={() =>
                classnames('w-fit  flex items-center outline-none gap-2 px-3 py-2.5 text-base font-medium leading-5 bg-black', result == index ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-800 hover:text-blue-800')
              }
            >
              <span className={`${theme.darkMode ? 'text-white' : ''} mt-3`}>{tab.icon}</span>
              <span className={`${theme.darkMode ? 'text-white hover:text-blue-400' : ''} mt-3`}>{tab.title}</span>
            </Tab>
          ))}
          {path == 'tasks' && (
            <Tab className="flex-1 cursor-default">
              <Filtering arrayItem={arrayItem} setArrayItem={setArrayItem} />
            </Tab>
          )}
        </TabList>
        <TabPanels className={'w-full mt-2 seamlessly'}>{children}</TabPanels>
      </TabGroup>
    </div>
  );
};

export default Tabs;
