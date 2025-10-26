import ChartProjects from '@/components/ChartProjects';
import CompactTable from '@/components/CompactTable';
import CellAction from '@/components/table/CellAction';
import ColumnHeader from '@/components/table/ColumnHeader';
import { router } from '@inertiajs/react';
import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

const ProjectWithProbs = React.memo(({filters}) => {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const months = useMemo(
        () => ({
            Январь: 'january',
            Февраль: 'february',
            Март: 'march',
            Апрель: 'april',
            Май: 'may',
            Июнь: 'june',
            Июль: 'july',
            Август: 'august',
            Сентябрь: 'september',
            Октябрь: 'october',
            Ноябрь: 'november',
            Декабрь: 'december',
        }),
        []
    );

    const columns = useMemo(() => {
        const base = [
            {
                accessorKey: 'action',
                header: 'ДЕЙСТВИЯ',
                width: '50px',
                cell: (value) => <CellAction value={value} />,
            },
            {
                accessorKey: 'name',
                width: '150px',
                header: 'Название'
            },
            {
                accessorKey: 'service.name',
                width: '150px',
                header: 'Сервис'
            }
        ];

        const monthColumns = Object.keys(months).map((month) => ({
            accessorKey: `income_costs_with_probability.${months[month]}`,
            header: month.toUpperCase(),
            width: '100px',
            cell: (value) => {
                const val = value.getValue();
                if (!val)
                    return <div className="text-xs text-gray-400">-</div>;

                const { income, income_p, cost, cost_p } = val;

                return (
                    <div className="grid grid-cols-2 grid-rows-2 border border-gray-200 text-center text-[11px] leading-tight text-gray-800">
                        <div className="border-r border-b bg-gray-200 p-[2px]">
                            {income ?? '-'}
                        </div>
                        <div className="border-b bg-blue-200 p-[2px] text-black">
                            {income_p ?? '-'}
                        </div>
                        <div className="border-r bg-gray-400 p-[2px]">
                            {cost ?? '-'}
                        </div>
                        <div className="bg-[#ff4f12]/50 p-[2px] text-black">
                            {cost_p ?? '-'}
                        </div>
                    </div>
                );
            },
        }));

        return [...base, ...monthColumns];
    }, [months, filters]);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(route('board.projects.probs'), {
                params: { page: page + 1, perPage, filters: filters},
            });
            setData(res.data.data);
            setTotal(res.data.total);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        } finally {
            setLoading(false);
        }
    }, [page, perPage, filters]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handlePageChange = useCallback((_, newPage) => {
        setPage(newPage);
    }, []);

    const handleRowsPerPageChange = useCallback((event) => {
        setPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, []);

    const legend = useMemo(
        () => (
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-700">
                <div className="flex items-center gap-1">
                    <div className="h-4 w-4 border border-gray-400 bg-gray-200"></div>
                    <span>Доход</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="h-4 w-4 border border-blue-400 bg-blue-200"></div>
                    <span>Доход (вероятностный)</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="h-4 w-4 border border-gray-500 bg-gray-400"></div>
                    <span>Расход</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="h-4 w-4 border border-[#ff4f12] bg-[#ff4f12]/50"></div>
                    <span>Расход (вероятностный)</span>
                </div>
            </div>
        ),
        []
    );

    const additional = useCallback(
        () => (
            <div className="flex gap-2">
                <button
                    onClick={() => router.get(route('projects.create'))}
                    className="rubik cursor-pointer rounded-sm bg-[#7700ff] p-3 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
                >
                    Новый
                </button>
            </div>
        ),
        []
    );

    return (
        <div>
            <h1 className="py-4 text-2xl font-semibold text-gray-500">
                {"ВЫРУЧКА С УЧЕТОМ ВЕРОЯТНОСТИ"}
            </h1>

            <ChartProjects data={data} type="income" />

            <div className="rubik rounded-md border border-gray-200 bg-white">
                <div className="flex w-full justify-end py-2 px-2">
                    {legend}
                </div>

                <CompactTable
                    columns={columns}
                    data={data}
                    total={total}
                    loading={loading}
                    page={page}
                    perPage={perPage}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    title="Проекты"
                    additionl={additional}
                />
            </div>
        </div>
    );
});

export default ProjectWithProbs;
