<?php

namespace App\Http\Controllers;

use App\Models\DateSeries;
use App\Models\Indicator;
use App\Models\PaymentType;
use App\Models\Project;
use App\Models\RevenueAccrualStatus;
use App\Models\Segment;
use App\Models\Stage;
use App\Services\StatisticService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class ProjectController extends Controller
{
    public function __construct(protected StatisticService $statisticService) {}

    public function drop(Project $project, Stage $stage)
    {
        $project->stage_id = $stage->id;
        $project->stage_changed_at = now();
        $project->save();
        return Redirect::back();
    }

    public function show(Project $project)
    {
        $stages = Stage::query()->orderBy('order', 'asc')->get();
        $project->load(['stage', 'manager', 'dateSeries', 'service']);
        // dd($project->dateSeries);
        $statuses = RevenueAccrualStatus::pluck('name')->toArray();
        $paymentTypes = PaymentType::all()->map(fn($e) => ['value' => $e->id, 'label' => $e->name]);
        $segments = Segment::all()->map(fn($e) => ['value' => $e->id, 'label' => $e->name]);
        $chartData = $this->statisticService->getIncomeCostsWithProbability($project);
        $project->setAttribute('income_costs_with_probability', $chartData);

        return Inertia::render('Projects/Project', compact(
            'project',
            'stages',
            'statuses',
            'paymentTypes',
            'segments',
        ));
    }

    public function index(Request $request)
    {
        if ($request->has("page")) {
            $projects = Project::with([
                'stage',
                'segment',
                'manager',
                'paymentType',
                'service',
                'dateSeries',
            ])->paginate(10);
            return $projects;
        }
        return Inertia::render('Projects/Index');
    }

    public function create()
    {
        // 
    }

    public function update(Request $request, int|null $id = null)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'segment_id' => 'nullable|integer',
            'service_id' => 'nullable|integer',
            'payment_type_id' => 'nullable|integer',
            'description' => 'nullable|string',
            'dateSeries' => 'nullable|array',
            'manager_id' => 'nullable|integer',
        ]);

        $project = Project::updateOrCreate([
            'id' => $id,
        ], $validated);

        $dateSeries = $validated['dateSeries'] ?? null;
        $project->dateSeries()->updateOrCreate([
            'id' => $project->dateSeries->id,
            'project_id' => $project->id,
        ], [...$dateSeries, 'project_id' => $project->id]);
    }

    public function destroy(Project $project)
    {
        $project->delete();
        return Redirect::back();
    }

    public function getlogs(Project $project)
    {
        $log = Activity::query()
            ->where('subject_type', Project::class)
            ->where('subject_id', $project->id);
        return $log->paginate(10)->through(function ($e) {
            $exp = explode('\\', $e->subject_type);
            $e->subject_type = $exp[count($exp) - 1] ?? null;
            return $e;
        });
    }
}
