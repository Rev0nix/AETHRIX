import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler
);

const RevenueChart = ({ data = [] }) => {
    const chartData = {
        labels: data.map((d) => d._id),
        datasets: [
            {
                label: "Revenue (₹)",
                data: data.map((d) => d.revenue),
                borderColor: "#2563eb",
                backgroundColor: "rgba(37,99,235,0.15)",
                borderWidth: 3,
                pointRadius: 5,
                pointHoverRadius: 7,
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    color: "#fff",
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: "#aaa",
                },
                grid: {
                    color: "rgba(255,255,255,0.05)",
                },
            },
            y: {
                ticks: {
                    color: "#aaa",
                },
                grid: {
                    color: "rgba(255,255,255,0.05)",
                },
            },
        },
    };

    return (
        <div className="bg-base-900 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-5">
                Revenue (Last 7 Days)
            </h2>

            <Line
                data={chartData}
                options={options}
            />
        </div>
    );
};

export default RevenueChart;