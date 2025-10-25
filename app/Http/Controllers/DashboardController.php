<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Services\StatisticService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(protected StatisticService $statisticService) {}
    public function index()
    {

        $data = $this->statisticService->getStatistic();
        return Inertia::render('Dashboard/Index', compact('data'));
    }
    
    public function getProjects(Request $request) {

            $projects = Project::paginate(10)->through(function ($project) {
                $incWP = $this->statisticService->getIncomeCostsWithProbability($project);
                $project->setAttribute('income_costs_with_probability', $incWP);
                return $project;
            });
            return $projects;
    }
}
