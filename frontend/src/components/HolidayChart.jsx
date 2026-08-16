import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
);

const HolidayChart = () => {

    const data = {
        labels: [
            "Jan", "Feb", "Mar", "Apr",
            "May", "Jun", "Jul", "Aug",
            "Sep", "Oct", "Nov", "Dec"
        ],

        datasets: [
            {
                label: "Holidays",
                data: [2, 1, 2, 1, 3, 2, 1, 2, 3, 1, 2, 4],

                borderRadius: 4,

                barThickness: 22
            }
        ]
    };

    const options = {
        responsive: true,

        plugins: {
            legend: {
                display: false
            }
        },

        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

    return (
        <div className="holiday-chart">

            <h2>Holidays in Each Month (2026)</h2>

            <Bar
                data={data}
                options={options}
            />

        </div>
    );
};

export default HolidayChart;