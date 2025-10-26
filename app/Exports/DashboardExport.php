<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Illuminate\Support\Collection;

class DashboardExport implements WithMultipleSheets
{
    public function __construct(protected $projects, protected $projectsAvg) {}

    public function sheets(): array
    {
        return [
            new ProjectsSheet($this->projects),
            new ProjectsAvgSheet($this->projectsAvg),
        ];
    }
}

// Лист с проектами и доходами/расходами
class ProjectsSheet implements FromCollection, WithHeadings
{
    protected $projects;
    protected static $months = [
        'january', 'february', 'march', 'april', 'may', 'june', 
        'july', 'august', 'september', 'october', 'november', 'december'
    ];

    public function __construct($projects)
    {
        $this->projects = $projects;
    }

    public function collection()
    {
        $rows = collect();

        foreach ($this->projects as $project) {
            foreach (self::$months as $month) {
                $monthData = $project->income_costs_with_probability[$month] ?? null;
                $rows->push([
                    'ID' => $project->id,
                    'Название' => $project->name,
                    'Сервис' => $project->service?->name,
                    'Месяц' => ucfirst($month),
                    'Доход' => $monthData['income'] ?? null,
                    'Расход' => $monthData['cost'] ?? null,
                    'Доход (вероятность)' => $monthData['income_p'] ?? null,
                    'Расход (вероятность)' => $monthData['cost_p'] ?? null,
                    'Статус' => $monthData['status'] ?? null,
                ]);
            }
        }

        return $rows;
    }

    public function headings(): array
    {
        return [
            'ID',
            'Название',
            'Сервис',
            'Месяц',
            'Доход',
            'Расход',
            'Доход (вероятность)',
            'Расход (вероятность)',
            'Статус',
        ];
    }
}



// Лист со средними длительностями стадий
class ProjectsAvgSheet implements FromCollection, WithHeadings
{
    protected $projectsAvg;

    public function __construct($projectsAvg)
    {
        $this->projectsAvg = $projectsAvg;
    }

    public function collection()
    {
        $rows = collect();

        foreach ($this->projectsAvg as $project) {
            foreach ($project['stages_durations'] as $stage) {
                $rows->push([
                    'Проект ID' => $project['project_id'],
                    'Название проекта' => $project['name'],
                    'Сервис' => $project['service']?->name,
                    'Стадия ID' => $stage['stage_id'],
                    'Название стадии' => $stage['stage_name'],
                    'Общее время' => $stage['total'],
                    'Количество записей' => $stage['count'],
                    'Среднее время' => $stage['avg'],
                ]);
            }
        }

        return $rows;
    }

    public function headings(): array
    {
        return ['Проект ID', 'Название проекта', 'Сервис', 'Стадия ID', 'Название стадии', 'Общее время', 'Количество записей', 'Среднее время'];
    }
}
