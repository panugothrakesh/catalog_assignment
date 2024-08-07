import React from 'react';
import CombinedChart from './widgets/CombinedChart';
import Assignment from './components/assignment';
import FetchData from './Fetch/Fetch'

const App = () => {
  // const [timePeriod, setTimePeriod] = useState('1week');
  return (
    <div className='font-circular text-[#1A243A] px-12 py-16'>
      <Assignment/>
      <FetchData/>
      <CombinedChart/>
    </div>
  )
}

export default App