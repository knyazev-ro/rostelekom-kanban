import CompactTable from '@/components/CompactTable';
import CellAction from '@/components/table/CellAction';
import ColumnHeader from '@/components/table/ColumnHeader';

export default function TimeOnStagePerProjects({ data, stages }) {
    console.log(data)
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
    ];

    const stagesColumns = stages.map((e) => {
        return {
            accessorKey: 'stages_durations',
        }
    })

    return (
        <div className="text-stone-950">
            <CompactTable
                columns={columns}
                data={data}
                total={100}
                loading={false}
                page={1}
                perPage={50}
                onPageChange={() => {}}
                onRowsPerPageChange={() => {}}
            />
        </div>
    );
}
