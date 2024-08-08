import React from 'react'
import { Bar, ResponsiveContainer, XAxis, YAxis, BarChart, } from 'recharts'

function BarChartComp( { volumeData, tickFormatter}) {
  return (
    <div
                className="absolute bottom-0 left-0 right-0 h-16 -z-10"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={volumeData}>
                    <XAxis
                      dataKey="date"
                      tickFormatter={tickFormatter}
                      hide={true}
                    />
                    <YAxis hide={true} />
                    <Bar dataKey="volume" fill="#E6E8EB" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
  )
}

export default BarChartComp