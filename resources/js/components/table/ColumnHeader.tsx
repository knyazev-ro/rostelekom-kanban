import { ArrowDownIcon, ArrowsUpDownIcon, ArrowUpIcon } from '@heroicons/react/16/solid';
import { useState } from 'react';

export default function ColumnHeader({
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
                    <input
                        type="text"
                        className="rounded-md bg-white px-2 py-1 text-sm font-medium text-black"
                        onChange={(e) => {
                            setSortAndFilter({
                                ...sortAndFilter,
                                filters: [...sortAndFilter.filters.filter((e: any) => e.column !== col), { column: col, value: e.target.value }],
                            });
                        }}
                    />
                )}
            </div>
            <div className="flex h-8 min-w-12 cursor-pointer items-center justify-center gap-1 p-1 hover:bg-blue-600" onClick={changeSort}>
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
