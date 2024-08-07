import React from 'react'

function Navbar() {
  return (
    <div className='w-full border-b-[1px]'>
        <ul className='flex gap-3 text-[#6F7177]'>
            <li className='text-lg flex justify-center items-center px-2 py-4'>Summary</li>
            <li className='text-lg flex justify-center items-center px-2 py-4 border-b-[3px] text-[#1A243A] border-[#4B40EE]'>Chart</li>
            <li className='text-lg flex justify-center items-center px-2 py-4'>Statistics</li>
            <li className='text-lg flex justify-center items-center px-2 py-4'>Analysis</li>
            <li className='text-lg flex justify-center items-center px-2 py-4'>Settings</li>
        </ul>
    </div>
  )
}

export default Navbar