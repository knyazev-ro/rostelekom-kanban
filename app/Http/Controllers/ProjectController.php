<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Stage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function drop(Project $project, Stage $stage) {
        $project->stage_id = $stage->id;
        $project->stage_changed_at = now();
        $project->save();
        return Redirect::back();
    }

    public function show(Project $project, Stage $stage) {
        // TODO: implement show logic
    }

    public function index(Request $request) {
        if($request->has("page")) {
            $projects = Project::with([
                'stage',
                'segment',
                'manager',
                'paymentType',
                'service',
            ])->paginate(10);
            return $projects;
        }
        return Inertia::render('Projects/Index');
    }

    public function create() {
        // 
    }

    public function update(Request $request, int|null $id = null) {
        // 
    }
}
