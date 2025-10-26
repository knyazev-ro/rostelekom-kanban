<?php

namespace App\Http\Controllers;

use App\Exports\DashboardExport;
use App\Models\Project;
use App\Services\StatisticService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class DashboardController extends Controller
{
    public function __construct(protected StatisticService $statisticService) {}
    public function index()
    {

        $data = $this->statisticService->getStatistic();
        return Inertia::render('Dashboard/Index', compact('data'));
    }

    public function getProjects(Request $request)
    {
        $filters = array_filter($request->query('filters', []));
        $projects = Project::query()
            ->with('service')
            ->when(!empty($filters), function ($query) use ($filters) {
                return $query->where($filters);
            })
            ->paginate(10)->through(function ($project) {
                $incWP = $this->statisticService->getIncomeCostsWithProbability($project);
                $project->setAttribute('income_costs_with_probability', $incWP);
                return $project;
            });
        return $projects;
    }

    public function getProjectsAvgPerStageDuration(Request $request)
    {
        return $this->statisticService->getAvgTimeOnStagePerProjects($request);
    }

    public function generateXlsx(Request $request)
    {
        $validated = $request->validate([
            'filters' => 'nullable|array',
        ]);

        $filters = array_filter($validated['filters'] ?? []);
        $projects = Project::query()
            ->with('service')
            ->when(!empty($filters), function ($query) use ($filters) {
                return $query->where($filters);
            })
            ->get()->map(function ($project) {
                $incWP = $this->statisticService->getIncomeCostsWithProbability($project);
                $project->setAttribute('income_costs_with_probability', $incWP);
                return $project;
            });

                $pojectsAvg = Project::with(['projectStagesDurations', 'projectStagesDurations.stage', 'service'])
            ->has('projectStagesDurations')
            ->get()
            ->map(function($project) {
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
            $filterNames = implode('__', collect($filters)->map(function($value, $key) {
                return $key . '_' . $value;
            })->toArray());
            Excel::store(new DashboardExport($projects, $pojectsAvg), 'export.xlsx', 'public');
            return Excel::download(new DashboardExport($projects, $pojectsAvg),  now()->format('Y-m-d h-i-s') . '_' . $filterNames . ' _export.xlsx');
    }
}
