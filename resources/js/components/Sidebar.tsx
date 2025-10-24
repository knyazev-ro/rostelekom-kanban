import { BuildingOffice2Icon, BuildingOfficeIcon, ChartBarIcon, DocumentArrowUpIcon } from '@heroicons/react/16/solid';
import { router } from '@inertiajs/react';
import { BoxIcon, ShipWheelIcon } from 'lucide-react';

export default function Sidebar() {
    const menuItems = [
        {
            name: 'Канбан',
            href: route('kanban.index'),
            bigIcon: BoxIcon,
        },
                {
            name: 'Дешброд',
            href: route('kanban.index'),
            bigIcon: BoxIcon,
        },
        {
            name: 'Отчеты',
            href: route('kanban.index'),
            bigIcon: BoxIcon,
        },
                {
            name: 'Проекты',
            href: route('kanban.index'),
            bigIcon: BoxIcon,
        },
    ];

    return (
        <div className="flex w-64 flex-col bg-gray-100 p-4 text-black">
            {menuItems.map((item, index) => (
                <div
                    className="flex cursor-pointer items-center gap-2 p-3 text-sm leading-3.5 font-medium hover:bg-gray-200"
                    key={index}
                    onClick={() => router.get(item.href)}
                >
                    {<item.bigIcon className="max-w-5 min-w-5" />}
                    {item.name}
                </div>
            ))}
        </div>
    );
}
