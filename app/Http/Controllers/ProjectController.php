<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Stage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class ProjectController extends Controller
{
    public function drop(Project $project, Stage $stage) {
        $project->stage_id = $stage->id;
        $project->stage_changed_at = now();
        $project->save();
        return Redirect::back();
    }
}
