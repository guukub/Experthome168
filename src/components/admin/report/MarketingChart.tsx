import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface MarketingChartProps {
  chartData: any[]
}

export default function MarketingChart({ chartData }: MarketingChartProps) {
  return (
    <div className="col-span-7 border border-gray-200 rounded-xl overflow-hidden bg-white">
      <div className="bg-forest-800 text-white px-4 py-2 font-bold text-lg">
        กราฟสรุปผลการตลาด (เปรียบเทียบรายเดือน)
      </div>
      <div className="p-4 h-[250px] w-full pt-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Legend verticalAlign="top" height={36} iconType="square" wrapperStyle={{ top: -20, fontSize: '12px' }}/>
            <Line type="monotone" dataKey="LivingInsider" stroke="#1e40af" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="DDproperty" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="propertyhub" stroke="#60a5fa" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
