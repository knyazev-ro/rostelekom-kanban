<?php

namespace App\Services;

use App\Models\DateSeries;
use App\Models\Project;
use App\Models\Stage;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class StatisticService
{
    protected static $months = [
        'january',
        'february',
        'march',
        'april',
        'may',
        'june',
        'july',
        'august',
        'september',
        'october',
        'november',
        'december',
    ];

    public function getStatistic(): array {

        $dateSeries = $this->calculateIncomeAndCostsTotal();

        return [
            'totalProjects' => Project::count(),
            'incomeTotal' => $dateSeries['income'],
            'costsTotal' => $dateSeries['costs'],
            'stages' => Stage::all(),
        ];
    }

    public function calculateIncomeAndCostsTotal() {
        $dateSeries = DateSeries::get()->map(function($item) {
            $d = collect(static::$months)->map(fn($month) => $item[$month]);
            return [
                'income' => $d->sum('value'),
                'cost' => $d->sum('cost'),
            ];
        });

        return [
            'income' => $dateSeries->sum('income'),
            'costs' => $dateSeries->sum('cost'),
        ];
    }

    public function getStatisticsByManagers() { 
        // 
    }

    public function getStatisticsByServices() { 
        // 
        }

    public function getAvgTimeOnStagePerProjects(Request $request) {
        $pojects = Project::with(['projectStagesDurations', 'projectStagesDurations.stage', 'service'])
            ->has('projectStagesDurations')
            ->paginate(10)
            ->through(function($project) {
                $stagesDurations = $project->projectStagesDurations->groupBy('stage_id')
                    ->map(function($durations) {
                    $totalDuration = $durations->reduce(function($carry, $item) {
                        return $carry + $item->duration;
                    }, 0);
                    return [
                        'stage_id' => $durations->first()->stage_id,
                        'stage_name' => $durations->first()->stage->name,
                        'total' => $totalDuration,
                        'count' => $durations->count(),
                        'avg' => $totalDuration / $durations->count(),
                    ];
                });
                return [
                    'project_id' => $project->id,
                    'service' => $project->service,
                    'name' => $project->name,
                    'stages_durations' => $stagesDurations->values(),
                ];
            });
        return $pojects;
    }

    public function getIncomeCostsWithProbability(Project $project): Collection {
        $dateSeries = $project->dateSeries->only(static::$months);
        $stage = $project->stage;
        $prob = $stage->probability ?? 0;
        $probIncome = $prob;
        $costIncome = 1 - $prob;
        $dateSeriesWithProbability = collect($dateSeries)->map(function($monthData) use ($probIncome, $costIncome) {
            return [
                'income' => round($monthData['value'], 1),
                'cost' =>round( $monthData['cost'], 1),
                'income_p' => round($monthData['value'] * $probIncome, 1),
                'cost_p' => round( $monthData['cost'] * $costIncome, 1),
                'status' => $monthData['status'],
            ];
        });
        return $dateSeriesWithProbability;

    }

    public function getAllIncomeCostsWithProbability() {
        $porjects = Project::all()->mapWithKeys(function ($project) {
            $project->setAttribute('income_costs_with_probability', $this->getIncomeCostsWithProbability($project));
        });
        return $porjects;
    }
}
    