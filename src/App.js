import React from 'react';
import CombinedChart from './widgets/CombinedChart';
import Introduction from './components/Documentation/Introduction'
import Footer from './components/Documentation/Footer'

const App = () => {
  return (
    <div className='font-circular text-[#1A243A] py-12 px-16 flex flex-col gap-10'>
      <Introduction/>
      <div className='md:w-3/5 w-full'>
      <CombinedChart/>
      </div>
      <Footer/>
    </div>
  )
}

export default App