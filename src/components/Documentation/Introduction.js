import React from 'react'

function Introduction() {
  return (
    <>
    <div className='flex flex-col'>
        <div className='flex items-center gap-3'>
            <img src="logo.jpg" alt="" className='h-8 rounded-md'/>
            <h1 className='text-4xl font-bold'>Catalog Assignment</h1>
        </div>
        <p className='text-lg text-[#6F7177] leading-8 md:w-3/4 w-full mt-8'>As part of the interview process, I was assigned a task to convert a provided Figma design into a functional ReactJS component using Recharts and API to fetch the Data. The goal was to accurately replicate the visual design and ensure the component is interactive.</p>
        <div className='w-full border mt-8'></div>
    </div>

    <div>
    <h1 className='text-4xl font-bold'>Reference Image (Exported)</h1>
        <img src="reference.png" alt="" className='md:w-[75%] w-full rounded-md'/>
        <div className='w-full border'></div>
    </div>
    <div className='mb-4'>
        <h1 className='text-4xl font-bold'>React Component </h1>
    </div>
    </>
  )
}

export default Introduction