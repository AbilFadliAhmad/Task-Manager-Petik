import { Tab, TabGroup, TabList, TabPanels } from '@headlessui/react'
import React from 'react'
import { useSelector } from 'react-redux'


const classnames = (...classes)=>{
    return classes.filter(Boolean).join('')
}
const Tabs = ({children, tabs, setSelected}) => {
    const {theme} = useSelector((state)=>state.auth)
    const handleClick = (index)=>{
        setSelected(index)
        localStorage.setItem('selected', String(index))
    }
    const result = localStorage.getItem('selected')
  return (
    <div className='w-full px-1 sm:px-0 '>
        <TabGroup>
            <TabList className='flex space-x-6 rounded-xl p-1 '>
                {tabs.map((tab,index)=>(
                    <Tab key={index + tab.title} onClick={()=>handleClick(index)} className={() => classnames("w-fit  flex items-center outline-none gap-2 px-3 py-2.5 text-base font-medium leading-5 bg-black", result == index ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-800 hover:text-blue-800')}>
                        <span className={`${theme.darkMode ? "text-white" : ''}`}>{tab.icon}</span>
                        <span className={`${theme.darkMode ? "text-white hover:text-blue-400" : ''}`}>{tab.title}</span>
                    </Tab>
                ))}
            </TabList>
            <TabPanels className={'w-full mt-2 seamlessly'}>
                {children}
            </TabPanels>
        </TabGroup>
    </div>
  )
}

export default Tabs