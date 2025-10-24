import { RectangleGroupIcon } from '@heroicons/react/16/solid';
import { router } from '@inertiajs/react';
import { BarChart, BarChart2Icon, ChartArea, ShipIcon } from 'lucide-react';

export default function Header() {
    return (
        <div className="text-md rubik top-0 flex h-14 w-screen min-w-screen items-center justify-between border-b-2 border-[#7700ff]/10 bg-white p-4 font-semibold text-stone-950">
            <div className="flex items-center">
                <ChartArea className="mr-2 size-6 bg-[#7700ff] fill-white text-[#7700ff] ring-2 ring-[#7700ff]" />
                {'CRM РОСТЕЛЕКОМ: АНАЛИТИКА'.toUpperCase()}
            </div>
            <div
                onClick={() => router.post(route('logout'))}
                className="rubik flex cursor-pointer items-center rounded-xs p-2 text-sm hover:bg-gray-100"
            >
                {'Выход'}
                <RectangleGroupIcon className="ml-2 size-5 fill-black" />
            </div>
        </div>
    );
}
