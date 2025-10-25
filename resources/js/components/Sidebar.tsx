import { useEffect, useState } from 'react';
import { ChartBarIcon, PaperClipIcon } from '@heroicons/react/16/solid';
import { router } from '@inertiajs/react';
import { BoxIcon, GitBranchPlus, ChevronLeft, ChevronRight, UserRoundCog } from 'lucide-react';

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(localStorage.getItem('bar') === '1' ? true : false);

    const menuItems = [
        { name: 'Канбан', href: route('kanban.index'), icon: BoxIcon },
        { name: 'Дешборд', href: route('board.index'), icon: ChartBarIcon },
        { name: 'Отчеты', href: route('reports.index'), icon: PaperClipIcon },
        { name: 'Проекты', href: route('projects.index'), icon: GitBranchPlus },
        { name: 'Пользователи', href: route('users.index'), icon: UserRoundCog },
    ];

    return (
        <div
            className={`flex flex-col h-screen transition-all duration-300 border-r border-stone-300 bg-stone-100 p-4 ${
                collapsed ? 'w-20' : 'w-64'
            }`}
        >
            {/* Кнопка сворачивания */}
            <button
                onClick={() => {
                    setCollapsed((c) => {
                        localStorage.setItem('bar', !c ? '1' : '0');
                        return !c;
                    })
                }}
                className="flex items-center justify-center mb-6 text-stone-600 hover:text-stone-800 transition"
            >
                {collapsed ? (
                    <ChevronRight className="h-5 w-5" />
                ) : (
                    <ChevronLeft className="h-5 w-5" />
                )}
            </button>

            {/* Навигация */}
            <nav className="space-y-1">
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => router.get(item.href)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition hover:bg-stone-200 ${
                            collapsed ? 'justify-center' : ''
                        }`}
                    >
                        <item.icon className="h-5 w-5 text-stone-600" />
                        {!collapsed && (
                            <span className="text-stone-800 text-sm font-medium">
                                {item.name}
                            </span>
                        )}
                    </div>
                ))}
            </nav>
        </div>
    );
}
