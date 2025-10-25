import Layout from '@/components/Layout';
import ProjectWithProbs from './ProjectWithProbs';
import TimeOnStagePerProjects from './TimeOnStagePerProjects';

export default function Index({data}) {
    return (
        <Layout>
            <div className="text-stone-950">
                <div className="flex gap-4 h-32">
                    <div className="rounded-md border p-3 flex flex-col h-full">
                        <h1 className='text-md font-semibold text-gray-400'>{"Общее".toUpperCase()}</h1>
                        <div className='flex flex-col'>
                            <div>
                            {`Проектов: ${data?.totalProjects ?? 0}`}

                            </div>
                            <div>
                            {`Выручка: ${data?.incomeTotal ?? 0}`}

                            </div>
                          <div>
                            {`Затраты: ${data?.costsTotal ?? 0}`}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex'>
            <ProjectWithProbs/>
            <TimeOnStagePerProjects data={data?.avgTimeOnStagePerProjects ?? []} stages={data?.stages ?? []}/>
            </div>

        </Layout>
    );
}
