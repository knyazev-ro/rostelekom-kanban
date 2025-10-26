import ChartProjects from '@/components/ChartProjects';
import Layout from '@/components/Layout';
import PickManagerCell from '@/components/PickManagerCell';
import PickPipelineCell from '@/components/PickPipelineCell';
import ProjectLogs from '@/components/ProjectLogs';
import YearlyDataForm from '@/components/YearlyDataForm';
import {
    HashtagIcon,
    MapIcon,
    UserCircleIcon,
} from '@heroicons/react/16/solid';
import { router, useForm } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { AsyncPaginate } from 'react-select-async-paginate';

export default function Project({
    project,
    stages,
    statuses,
    paymentTypes,
    segments,
}) {
    const [hoverStage, setHoverStage] = useState(null);
    const [editName, setEditName] = useState(false);

    const formData = (project) => {
        return {
            id: project.id,
            name: project?.name ?? '',
            //   amount: project?.amount ?? null,
            //   pipeline: project?.pipeline ?? null,
            stage: project?.stage ?? null,
            //   responsible: project?.responsible ?? null,
            //   company: project?.company ?? null,
            //   contacts: project?.contacts ?? [],
            payment_type_id: project?.payment_type_id ?? null,
            dateSeries: project?.date_series ?? null,
            manager: project?.manager ?? null,
            stage_id: project?.stage_id ?? null,
            description: project?.description ?? '',
            segment_id: project?.segment_id ?? '',
            service_id: project?.service?.id ?? null,
            service_name: project?.service?.name ?? null,
        };
    };

    const { data, setData } = useForm(formData(project));

    useEffect(() => {
        if (project) {
            setData(formData(project));
        }
    }, [project]);

    const pickStageColor = (stage) => {
        const stageTypeColor = {
            0: stage.options?.column_header_color ?? '#83B94C',
            1: '#a1a7b7',
            2: '#4e9bed',
            3: '#fc3f5b',
        };
        return stageTypeColor[stage?.type] ?? '#83B94C';
    };

    console.log(project);

    const changeStyleOnHover = (stage, idx) => {
        const currentBkg =
            data?.stage?.order >= stage.order ? '#3761E9' : '#a1a7b7';
        return {
            backgroundColor: hoverStage
                ? idx <= hoverStage
                    ? pickStageColor(stage)
                    : currentBkg
                : currentBkg,

            color: hoverStage
                ? idx <= hoverStage
                    ? stage.options?.text_header_color
                    : '#FFFFFF'
                : '#FFFFFF',
        };
    };

    const handleChangeStage = (stage) => {
        if (project?.id) {
            router.post(route('kanban.drop', [project.id, stage.id]));
        }
    };

    const handleEditDeal = (data) => {
        router.post(route('projects.update', project.id), data);
    };

    const handleChangeDateSeries = (u) => {
        setData('dateSeries', u);
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

    return (
        <Layout>
            <div className="flex h-full h-screen flex-col overflow-y-hidden rounded-lg bg-white px-5 py-6 text-stone-950">
                <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-2xl font-bold md:flex-nowrap">
                        <div className='flex gap-2'>
                                            <div className='flex items-center justify-center text-xs text-gray-400'>
                        <HashtagIcon className="w-3" />
                        {project.id}
                        </div>

                    {editName ? (
                        <div className="-m-2 flex w-full items-center gap-2">
                            <input
                                style={{
                                    width: `${String(data.name || 0).length + 3}ch`,
                                }}
                                type="text"
                                className="border-t-0 border-r-0 border-b-1 border-l-0 border-gray-300 px-2 py-1 text-2xl leading-none"
                                value={data.name}
                                onChange={(e) => {
                                    setData('name', e.target.value);
                                }}
                                onBlur={() => {
                                    setEditName(false);
                                    handleEditDeal(data);
                                }}
                                autoFocus
                            />
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <h1
                                onClick={() => setEditName(true)}
                                className="cursor-pointer text-2xl leading-none hover:underline"
                            >
                                {data.name ? (
                                    data.name
                                ) : (
                                    <div className="text-gray-400">...</div>
                                )}
                            </h1>
                        </div>
                    )}
                                            </div>
                    <div className="flex items-center justify-center">
                        <button
                        onClick={() => handleEditDeal(data)}
                         className='bg-[#7700ff] text-white rounded-xs font-semibold text-sm p-2'>
                            Сохранить
                        </button>
                    </div>
                </div>

                <div className="flex w-full bg-white text-sm font-bold">
                    <div className="ml-7 flex w-full">
                        {stages.map((stage, idx) => (
                            <div
                                key={stage.id ?? idx}
                                style={{
                                    zIndex: stages.length - idx,
                                    position: 'relative',
                                }}
                                className="kanban-column -ml-7 flex min-w-0 flex-1 items-center justify-center rounded-l-lg bg-white px-1.5"
                            >
                                <div
                                    onClick={() => handleChangeStage(stage)}
                                    onMouseEnter={() => setHoverStage(idx)}
                                    onMouseLeave={() => setHoverStage(null)}
                                    className="kanban-column w-full cursor-pointer truncate rounded-l-lg bg-indigo-600 py-1.5 pl-7 text-center whitespace-nowrap text-white transition-colors duration-200"
                                    style={changeStyleOnHover(stage, idx)}
                                >
                                    {stage.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Горизонтальная информация */}
                <div className="flex w-full flex-col items-center justify-between border-b-1 border-stone-300 px-16 py-2 text-sm md:flex-row">
                    {/* amount */}
                    {/* <div className="flex h-full items-center gap-2 px-16 hover:bg-orange-500/5 py-2">
          <div>
            <CashIcon className="w-6 text-yellow-500 fill-yellow-100" />
          </div>
          <div className="flex flex-col">
            <div className="text-stone-500/80">{t('crm:totalSum')}</div>
            <div className="-translate-x-1.5 flex items-center">
              <input
                className="appearance-none  hover:underline border-none focus:border-b-1 text-sm h-4 px-1 text-right"
                type="number"
                value={data.amount}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.length <= 12) {
                    setData('amount', val);
                  }
                }}
                onBlur={() => {
                  handleEditDeal(data);
                }}
                style={{ width: `${String(data.amount || 0).length + 3}ch` }}
              />

              <div className="-translate-x-2"></div>
            </div>
          </div>
        </div> */}

                    <div className="flex h-full items-center gap-2 px-16 hover:bg-indigo-50/50">
                        <div>
                            <MapIcon className="w-6 fill-indigo-50 text-indigo-400" />
                        </div>
                        <div className="flex flex-col">
                            <div className="text-stone-500/80">{'Воронка'}</div>
                            <PickPipelineCell
                                data={data}
                                handleEditDeal={handleEditDeal}
                            />
                        </div>
                    </div>

                    <div className="flex h-full items-center gap-2 px-16 hover:bg-blue-50">
                        <div>
                            <UserCircleIcon className="w-6 fill-blue-50 text-blue-400" />
                        </div>
                        <div className="flex flex-col">
                            <div className="text-stone-500/80">
                                {'Менеджер'}
                            </div>
                            <PickManagerCell
                                data={data}
                                handleEditDeal={handleEditDeal}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    {/* Левая часть — красивая версия */}
                    <div className="flex max-w-md min-w-1/3 flex-col gap-4 border-r-1 border-b-1 border-l-1 border-gray-200 bg-white/60 p-4 backdrop-blur-md">
                        {/* Заголовок */}
                        <h2 className="mb-2 border-b pb-2 text-lg font-semibold text-gray-800">
                            Основные данные
                        </h2>

                        {/* Описание */}
                        <div>
                            <label className="mb-1 block text-sm text-gray-600">
                                Описание проекта
                            </label>
                            <input
                                className="w-full rounded-xl border border-gray-300 p-2 text-sm transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                value={data.description}
                                type="text"
                                placeholder="Введите описание..."
                                onChange={(e) => {
                                    setData('description', e.target.value)
                                }}
                            />
                        </div>

                        {/* Сегмент */}
                        <div>
                            <label className="mb-1 block text-sm text-gray-600">
                                Сегмент
                            </label>
                            <select
                                className="w-full rounded-xl border border-gray-300 p-2 text-sm transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                value={data.segment_id}
                                onChange={(e) =>
                                    setData('segment_id', e.target.value)
                                }
                            >
                                {segments?.map((s) => (
                                    <option key={s.value} value={s.value}>
                                        {s.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Тип оплаты */}
                        <div>
                            <label className="mb-1 block text-sm text-gray-600">
                                Тип оплаты
                            </label>
                            <select
                                className="w-full rounded-xl border border-gray-300 p-2 text-sm transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                value={data.payment_type_id}
                                onChange={(e) =>
                                    setData('payment_type_id', e.target.value)
                                }
                            >
                                {paymentTypes?.map((s) => (
                                    <option key={s.value} value={s.value}>
                                        {s.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Асинхронный выбор сервиса */}
                        <div>
                            <label className="mb-1 block text-sm text-gray-600">
                                Сервис
                            </label>
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
                                value={{
                                    value: data?.service_id,
                                    label: data?.service_name,
                                }}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        service_id: e.value,
                                        service_name: e.label,
                                    })
                                }
                            />
                        </div>

                        {/* Годовые данные */}
                        <div className="mt-2 border-t pt-2">
                            <h3 className="mb-2 text-sm font-medium text-gray-700">
                                Годовые данные
                            </h3>
                            <YearlyDataForm
                                initialData={data.dateSeries}
                                statusOptions={statuses}
                                onChange={handleChangeDateSeries}
                            />
                        </div>
                    </div>

                    {/* Правая часть */}
                    <div className='flex flex-col max-w-2/3'>
                        {/* График */}
                        <div>
                            <ChartProjects
                                data={[project ?? null].filter((e) => e)}
                            />
                        </div>

                        {/* Логи */}
                        <div>
                            {data?.id && <ProjectLogs projectId={data?.id} />}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
