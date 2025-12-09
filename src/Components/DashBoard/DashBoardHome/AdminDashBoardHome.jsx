import React from 'react'
import useAxiosSecure from '../../../Hooks/useAxiosSecure'
import { useQuery } from '@tanstack/react-query'
import { Legend, Pie, PieChart, Tooltip } from 'recharts'

const AdminDashBoardHome = () => {
    const axiosSecure = useAxiosSecure()
    const { data: deliveryStatus = [] } = useQuery({
        queryKey: ['delivery-status-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/parcels/delivery-status/stats')
            return res.data
        }
    })

    const getPieChartData = data => {
        return data.map(item => {
            return { name: item.status, value: item.count }
        })
    }
    return (
        <div>
            <h2 className='text-3xl text-center'>Admin Dashboard</h2>
            <div className="stats stats-vertical lg:stats-horizontal shadow">
                {
                    deliveryStatus.map(stat => <div key={stat._id} className="stat">
                        <div className="stat-title">{stat._id}</div>
                        <div className="stat-value">{stat.count}</div>
                        <div className="stat-desc">Jan 1st - Feb 1st</div>
                    </div>)
                }

            </div>
            <div className='w-full h-[400px]'>
                <PieChart style={{ width: '100%', maxWidth: '500px', maxHeight: '80vh', aspectRatio: 2 }} responsive>
                    <Pie
                        dataKey="value"
                        startAngle={180}
                        endAngle={0}
                        data={getPieChartData(deliveryStatus)}
                        cx="50%"
                        cy="100%"
                        outerRadius="120%"
                        fill="#8884d8"
                        label
                        isAnimationActive={true}
                    />
                    <Legend></Legend>
                    <Tooltip></Tooltip>
                </PieChart>
            </div>

        </div>
    )
}

export default AdminDashBoardHome