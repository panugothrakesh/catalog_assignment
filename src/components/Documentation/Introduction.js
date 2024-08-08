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

        <ol className='text-[#6F7177] space-y-3 mt-5 md:w-3/4 w-full'>
            <li >
            1. React Component is created using API and Recharts for UI. I have used TailwindCss for styling other components.
            </li>
            <li >
            2. I have made all the buttons functional i.e Fullscreen, the Range( 1d, 3d, 1w, 1m, 6m, 1y, max), and also the Navigation between different components( Summary, Chart, Statistics, Analysis, Settings)
            </li>
            <li >
            3. * I have assumed that the Vertical and Horizontal toolkit line will be snapped to the Linechart to show the corresponding Price on the right.
            </li>
            <li >
            4. I got the current price at the end of the Linechart to be displayed on all time.
            </li>
            <li >
            5. The live Data is from Polygon.io that display's the Current price on top, The change percentage with Red and Green color presenting a Negative and Positive change.
            </li>
        </ol>
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