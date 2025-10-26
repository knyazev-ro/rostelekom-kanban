import CompactTable from '@/components/CompactTable';
import CellAction from '@/components/table/CellAction';
import ColumnHeader from '@/components/table/ColumnHeader';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function TimeOnStagePerProjects({ stages, filters }) {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const columns = [
        {
            accessorKey: 'action',
            header: 'ДЕЙСТВИЯ',
            width: '50px',
            cell: (value) => <CellAction value={value} />,
        },
        {
            accessorKey: 'name',
            width: '150px',
            header: (
                <ColumnHeader
                    title="НАЗВАНИЕ"
                    col="name"
                    sortAndFilter={() => {}}
                    setSortAndFilter={() => {}}
                />
            ),
        },
                    {
                accessorKey: 'service.name',
                width: '150px',
                header: 'Сервис'
            }
    ];

    const stagesColumns = stages.map((e) => {
        return {
            accessorKey: 'stages_durations',
            header: e.name,
            width: '150px',
            cell: (value) => (
                <div>
                    {value.getValue()?.find((k) => k.stage_name === e.name)
                        ?.avg ?? null}
                </div>
            ),
        };
    });

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await axios.get(route('board.projects.time.stage'), {
                params: { page: page + 1, perPage, filters:filters },
            });
            setData(res.data.data);
            setTotal(res.data.total);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProjects();
    }, [page, perPage, filters]);

    const handlePageChange = (_, newPage) => setPage(newPage);
    const handleRowsPerPageChange = (event) => {
        setPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div className="flex flex-col border-b-1 text-stone-950">
            <h1 className="py-4 text-2xl font-semibold text-gray-500">
                {'Среднее время нахождения на этапе (в милисекундах)'.toUpperCase()}
            </h1>
            <div className="">
                <CompactTable
                    columns={[...columns, ...stagesColumns]}
                    data={data}
                    total={total}
                    loading={loading}
                    page={page}
                    perPage={perPage}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                />
            </div>
        </div>
    );
}
