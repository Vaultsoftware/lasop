import React from 'react'
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';

ChartJS.register(
    Tooltip,
    Legend,
    ArcElement
)

interface ChartType {
    chartType: any
}

function AttendanceDoughnut({ chartType }: ChartType) {
    const options = {
        cutout: '70%',
    }
    return (
        <Doughnut style={{ width: '100%' }} height={10} options={options} data={chartType} />
    )
}

export default AttendanceDoughnut