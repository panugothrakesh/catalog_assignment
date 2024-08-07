import React from 'react';

const Statistics = ({ isActive, onClick }) => {
  return (
    <div
      className={`text-lg flex justify-center items-center px-2 py-4 cursor-pointer ${isActive ? 'border-b-[3px] text-[#1A243A] border-[#4B40EE]' : 'text-[#6F7177]'}`}
      onClick={onClick}
    >
      Statistics
    </div>
  );
};

export default Statistics;
