import FTable from '@/components/FTable';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import Layout from '@/components/Layout';
import CellAction from '@/components/table/CellAction';
import ColumnHeader from '@/components/table/ColumnHeader';
import { router } from '@inertiajs/react';

const Index = () => {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);

    const [sortAndFilter, setSortAndFilter] = useState({
        filters: [],
        sortBy: null,
        sortDir: 'asc',
    });

    const columns = useMemo(() => [
        {
            accessorKey: 'action',
            header: 'ДЕЙСТВИЯ',
            cell: (value) => <CellAction value={value} />,
        },
        { accessorKey: 'id', header: 'ID' },
        {
            accessorKey: 'name',
            header: (
                <ColumnHeader
                    title="ИМЯ"
                    col="name"
                    sortAndFilter={sortAndFilter}
                    setSortAndFilter={setSortAndFilter}
                />
            ),
            cell: (value) => (
                <div className="flex justify-center text-sm font-medium text-gray-700">
                    {value.getValue()}
                </div>
            ),
        },
        {
            accessorKey: 'last_name',
            header: (
                <ColumnHeader
                    title="ФАМИЛИЯ"
                    col="last_name"
                    sortAndFilter={sortAndFilter}
                    setSortAndFilter={setSortAndFilter}
                />
            ),
            cell: (value) => (
                <div className="flex justify-center text-sm font-medium text-gray-700">
                    {value.getValue()}
                </div>
            ),
        },
        {
            accessorKey: 'email',
            header: (
                <ColumnHeader
                    title="EMAIL"
                    col="email"
                    sortAndFilter={sortAndFilter}
                    setSortAndFilter={setSortAndFilter}
                />
            ),
            cell: (value) => (
                <div className="flex justify-center text-sm font-mono text-gray-600">
                    {value.getValue()}
                </div>
            ),
        },
        {
            accessorKey: 'role',
            header: (
                <ColumnHeader
                    title="РОЛЬ"
                    col="role"
                    sortAndFilter={sortAndFilter}
                    setSortAndFilter={setSortAndFilter}
                />
            ),
            cell: (value) => {
                const role = value.getValue();
                const color =
                    role === 'admin'
                        ? 'bg-red-100 text-red-800'
                        : role === 'manager'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800';
                return (
                    <div
                        className={`text-xs font-medium p-1 px-2 rounded flex justify-center ${color}`}
                    >
                        {role?.toUpperCase() ?? ''}
                    </div>
                );
            },
        },
    ], [sortAndFilter]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get(route('users.index'), {
                params: { page: page + 1, perPage, ...sortAndFilter },
            });
            setData(res.data.data);
            setTotal(res.data.total);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, [page, perPage, sortAndFilter]);

    const handlePageChange = (_, newPage) => setPage(newPage);
    const handleRowsPerPageChange = (event) => {
        setPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Layout>
            <div className="bg-white shadow-md shadow-blue-100 rubik">
                <FTable
                    columns={columns}
                    data={data}
                    total={total}
                    loading={loading}
                    page={page}
                    perPage={perPage}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    title="Пользователи"
                    additionl={() => (
                        <div className="flex gap-2">
                            <button
                                onClick={() => router.get(route('users.create'))}
                                className="cursor-pointer hover:bg-blue-600 transition-colors text-sm rubik font-semibold rounded-sm bg-[#7700ff] p-3 text-white"
                            >
                                Новый пользователь
                            </button>
                        </div>
                    )}
                />
            </div>
        </Layout>
    );
};

export default Index;
