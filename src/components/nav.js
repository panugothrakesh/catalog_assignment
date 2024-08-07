import React from 'react';

function Navbar({ activeIndex, onNavClick }) {
  const navItems = ['Summary', 'Chart', 'Statistics', 'Analysis', 'Settings'];

  return (
    <div className='w-full border-b-[1px]'>
      <ul className='flex gap-3 text-[#6F7177]'>
        {navItems.map((item, index) => (
          <li
            key={index}
            onClick={() => onNavClick(index)}
            className={`text-lg flex justify-center items-center px-2 py-4 cursor-pointer ${
              activeIndex === index
                ? 'border-b-[3px] text-[#1A243A] border-[#4B40EE]'
                : ''
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Navbar;