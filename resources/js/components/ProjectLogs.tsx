import CompactTable from '@/components/CompactTable';
import CellAction from '@/components/table/CellAction';
import ColumnHeader from '@/components/table/ColumnHeader';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function ProjectLogs({ filters, projectId }) {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);

    const columns = [
        {
            accessorKey: 'action',
            header: 'ДЕЙСТВИЯ',
            width: '60px',
            cell: (value) => <CellAction value={value} />,
        },
        {
            accessorKey: 'id',
            header: 'ID',
            width: '80px',
        },
        {
            accessorKey: 'log_name',
            header: (
                <ColumnHeader
                    title="Название лога"
                    col="log_name"
                    sortAndFilter={() => {}}
                    setSortAndFilter={() => {}}
                />
            ),
            width: '150px',
        },
        {
            accessorKey: 'description',
            header: 'Описание',
            width: '300px',
            cell: (value) => (
                <div className="truncate max-w-[280px]">{value.getValue()}</div>
            ),
        },
        {
            accessorKey: 'event',
            header: 'Событие',
            width: '150px',
        },
        {
            accessorKey: 'subject_type',
            header: 'Тип субъекта',
            width: '180px',
        },
        {
            accessorKey: 'causer_id',
            header: 'ID инициатора',
            width: '120px',
        },
        {
            accessorKey: 'created_at',
            header: 'Создано',
            width: '180px',
            cell: (value) => {
                const date = value.getValue();
                return date ? new Date(date).toLocaleString() : '-';
            },
        },
    ];

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await axios.get(route('projects.logs.paginated', projectId), {
                params: { page: page + 1, perPage, filters },
            });
            setData(res.data.data);
            setTotal(res.data.total);
        } catch (error) {
            console.error('Ошибка загрузки логов:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLogs();
    }, [page, perPage, filters]);

    const handlePageChange = (_, newPage) => setPage(newPage);
    const handleRowsPerPageChange = (event) => {
        setPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div className="flex flex-col border-b-1 text-stone-950">
            <h1 className="py-4 text-2xl font-semibold text-gray-500">
                {'ЛОГИ ПРОЕКТА'.toUpperCase()}
            </h1>
            <CompactTable
                columns={columns}
                data={data}
                total={total}
                loading={loading}
                page={page}
                perPage={perPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
            />
        </div>
    );
}
