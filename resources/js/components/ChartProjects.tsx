import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
} from 'chart.js';
import { useState } from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
);

export default function ChartProjects({ data }) {
    const [type, setType] = useState('income');
    if (!data || data.length === 0) return <p>Нет данных</p>;

    const months = [
        'january',
        'february',
        'march',
        'april',
        'may',
        'june',
        'july',
        'august',
        'september',
        'october',
        'november',
        'december',
    ];

    // Преобразуем данные в формат Chart.js
    const chartData = {
        labels: [
            'Янв',
            'Фев',
            'Мар',
            'Апр',
            'Май',
            'Июн',
            'Июл',
            'Авг',
            'Сен',
            'Окт',
            'Ноя',
            'Дек',
        ],
        datasets: data.map((project, index) => ({
            label: project.name,
            data: months.map(
                (m) => project.income_costs_with_probability[m][type] || 0,
            ),
            borderColor: `hsl(${index * 40}, 80%, 60%)`,
            backgroundColor: `hsl(${index * 40}, 80%, 60%, 0.3)`,
            tension: 0.3,
            fill: false,
        })),
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: '#333' },
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
        },
        scales: {
            x: {
                ticks: { color: '#333' },
                grid: { display: false },
            },
            y: {
                ticks: { color: '#333' },
                beginAtZero: true,
            },
        },
    };
    console.log(type)

    return (
        <div className="w-full rounded-2xl p-4 text-stone-950">
            <div className="flex gap-4">
                <button
                    onClick={() => setType('income')}
                    className={`mb-3 text-lg font-semibold ${type === 'income' ? 'text-indigo-500' : ''}`}
                >
                    {'Доход по проектам'}
                </button>
                <button
                    onClick={() => setType('cost')}
                    className={`mb-3 text-lg font-semibold ${type === 'cost' ? 'text-indigo-500' : ''}`}
                >
                    {'Расходы по проектам'}
                </button>
                <button
                    onClick={() => setType('income_p')}
                    className={`mb-3 text-lg font-semibold ${type === 'income_p' ? 'text-indigo-500' : ''}`}
                >
                    {'Вероятный доход по проектам'}
                </button>
                <button
                    onClick={() => setType('cost_p')}
                    className={`mb-3 text-lg font-semibold ${type === 'cost_p' ? 'text-indigo-500' : ''}`}
                >
                    {'Вероятные расходы по проектам'}
                </button>
            </div>
            <Line data={chartData} options={options} />
        </div>
    );
}
