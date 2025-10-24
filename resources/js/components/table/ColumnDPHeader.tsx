import { ArrowDownIcon, ArrowsUpDownIcon, ArrowUpIcon } from '@heroicons/react/16/solid';
import { DatePicker } from '@heroui/react';
import { parseDate } from '@internationalized/date';
import { useState } from 'react';

export default function ColumnDPHeader({
    title,
    col,
    sortAndFilter,
    setSortAndFilter,
}: {
    title: string;
    col: string;
    sortAndFilter: any;
    setSortAndFilter: any;
}) {
    const [filter, setFilter] = useState(false);
    const changeSort = () => {
        if (sortAndFilter.sortBy !== col) {
            // при клике по новой колонке всегда начинаем с ASC
            setSortAndFilter({ ...sortAndFilter, sortDir: 'asc', sortBy: col });
        } else if (sortAndFilter.sortDir === 'asc') {
            setSortAndFilter({ ...sortAndFilter, sortDir: 'desc', sortBy: col });
        } else if (sortAndFilter.sortDir === 'desc') {
            setSortAndFilter({ ...sortAndFilter, sortDir: null, sortBy: null });
        } else {
            setSortAndFilter({ ...sortAndFilter, sortDir: 'asc', sortBy: col });
        }
    };

    const handleFilter = () => {
        setFilter((p) => !p);
        if (!filter) {
            setSortAndFilter({ ...sortAndFilter, filters: sortAndFilter.filters.filter((f: any) => f.column !== col) });
        }
    };

    return (
        <div className="flex cursor-pointer items-center gap-1 whitespace-nowrap">
            <div className="flex items-center gap-1">
                <div onClick={() => handleFilter()}>{title}</div>
                {filter && (
                    <DatePicker
                        popoverProps={{
                            className: 'bg-white dark:bg-sky-600 shadow-lg rounded-xl z-[9999]',
                        }}
                        className="z-10"
                        value={
                            sortAndFilter.filters.find((f: any) => f.column === col)?.value
                                ? parseDate(sortAndFilter.filters.find((f: any) => f.column === col).value)
                                : null
                        }
                        onChange={(date) => {
                            setSortAndFilter({
                                ...sortAndFilter,
                                filters: [...sortAndFilter.filters.filter((f: any) => f.column !== col), { column: col, value: date?.toString() }],
                            });
                        }}
                    />
                )}
            </div>
            <div className="flex h-8 min-w-12 cursor-pointer items-center justify-between gap-1 p-1 hover:bg-blue-600" onClick={changeSort}>
                {sortAndFilter.sortBy !== col ? (
                    <ArrowsUpDownIcon className="size-4 fill-white" />
                ) : sortAndFilter.sortDir === 'asc' ? (
                    <ArrowDownIcon className="size-4 fill-white" />
                ) : sortAndFilter.sortDir === 'desc' ? (
                    <ArrowUpIcon className="size-4 fill-white" />
                ) : (
                    <ArrowsUpDownIcon className="size-4 fill-white" />
                )}

                {/* Показываем ASC/DESC только для активного столбца */}
                {sortAndFilter.sortBy === col ? (sortAndFilter.sortDir?.toUpperCase() ?? '') : ''}
            </div>
        </div>
    );
}
