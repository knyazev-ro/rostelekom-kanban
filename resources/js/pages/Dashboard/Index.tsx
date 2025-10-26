import Layout from '@/components/Layout';
import axios from 'axios';
import { useState } from 'react';
import { AsyncPaginate } from 'react-select-async-paginate';
import ProjectWithProbs from './ProjectWithProbs';
import TimeOnStagePerProjects from './TimeOnStagePerProjects';
import { router } from '@inertiajs/react';

export default function Index({ data }) {
    const [filters, setFilters] = useState({
        manager_id: null,
        service_id: null,
    });

    const loadUsers = async (search, loadedOptions, { page }) => {
        let query = [`search=${search}`, page ? `page=${page}` : 'page=1']
            .filter((e) => e)
            .join('&');

        const url = route('users.paginated');

        return axios.get(`${url}?${query}`).then((result) => {
            return {
                options: result.data.data.map((e) => ({
                    value: e.id,
                    label: `${e.name} ${e.last_name}`
                        .replace('null', '')
                        .trim(),
                })),
                hasMore: result.data.next_page_url !== null,
                additional: {
                    page: result.data.current_page + 1,
                },
            };
        });
    };

    const loadServices = async (search, loadedOptions, { page }) => {
        let query = [`search=${search}`, page ? `page=${page}` : 'page=1']
            .filter((e) => e)
            .join('&');

        const url = route('services.paginated');

        return axios.get(`${url}?${query}`).then((result) => {
            return {
                options: result.data.data.map((e) => ({
                    value: e.id,
                    label: `${e.name}`.replace('null', '').trim(),
                })),
                hasMore: result.data.next_page_url !== null,
                additional: {
                    page: result.data.current_page + 1,
                },
            };
        });
    };

const handleExportXLSX = async () => {
    try {
        const response = await axios.get(route('board.xlsx'), {
            params: { filters }, // если нужны фильтры
            responseType: 'blob',  // важно!
        });

        // Создаём ссылку для скачивания
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;

        // Имя файла
        link.setAttribute('download', 'export.xlsx');

        document.body.appendChild(link);
        link.click();

        // Чистим
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Ошибка при скачивании Excel:', error);
    }
};


    return (
        <Layout>
            <div className="text-stone-950">
                <div className="flex flex-col gap-4">
                    {/* Заголовок секции */}
                    <h2 className="text-xl font-semibold text-gray-700">
                        Настройки страницы
                    </h2>

                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-700">
                            Статистика проектов
                        </h2>
                        <button
                            onClick={handleExportXLSX}
                            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-green-700 active:scale-95"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.8}
                                stroke="currentColor"
                                className="h-4 w-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 16.5v-9m0 0L8.25 11.25m3.75-3.75L15.75 11.25M3 19.5h18"
                                />
                            </svg>
                            Экспорт XLSX
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {/* Блок Общие данные */}
                        <div className="col-span-1 flex flex-col justify-between rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-5 shadow-sm transition hover:shadow-md">
                            <h3 className="mb-3 text-sm font-semibold tracking-wider text-gray-400 uppercase">
                                Общие данные
                            </h3>
                            <div className="space-y-1.5 text-sm text-gray-700">
                                <div className="flex justify-between">
                                    <span>Проектов:</span>
                                    <span className="font-medium">
                                        {data?.totalProjects ?? 0}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Выручка:</span>
                                    <span className="font-medium text-green-600">
                                        {data?.incomeTotal ?? 0}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Затраты:</span>
                                    <span className="font-medium text-red-500">
                                        {data?.costsTotal ?? 0}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Блок фильтров */}
                        <div className="col-span-2 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                            <h3 className="mb-2 text-sm font-semibold tracking-wider text-gray-400 uppercase">
                                Фильтры
                            </h3>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <AsyncPaginate
                                    noOptionsMessage={() => 'Не выбрано'}
                                    loadingMessage={() => 'Загрузка...'}
                                    className="overflow-visible"
                                    placeholder="Найти по менеджеру"
                                    maxMenuHeight={150}
                                    menuPlacement="auto"
                                    defaultOptions
                                    loadOptions={loadUsers}
                                    additional={{ page: 1 }}
                                    value={data?.created_by}
                                    onChange={(e) =>
                                        setFilters((d) => ({
                                            ...d,
                                            manager_id: e.value,
                                        }))
                                    }
                                />

                                <AsyncPaginate
                                    noOptionsMessage={() => 'Не выбрано'}
                                    loadingMessage={() => 'Загрузка...'}
                                    className="overflow-visible"
                                    placeholder="Найти по сервису"
                                    maxMenuHeight={150}
                                    menuPlacement="auto"
                                    defaultOptions
                                    loadOptions={loadServices}
                                    additional={{ page: 1 }}
                                    value={data?.created_by}
                                    onChange={(e) =>
                                        setFilters((d) => ({
                                            ...d,
                                            service_id: e.value,
                                        }))
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-6">
                <ProjectWithProbs filters={filters} />
                <TimeOnStagePerProjects
                    filters={filters}
                    stages={data?.stages ?? []}
                />
            </div>
        </Layout>
    );
}
