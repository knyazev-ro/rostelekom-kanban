<?php

use App\Http\Controllers\PipelineController;
use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('/test', function () {
    return Inertia::render('ProjectCard');
});

Route::prefix('kanban')->name('kanban.')->group(function () {
    Route::get('/', [PipelineController::class, 'kanban'])->name('index');
    Route::post('/drop/{project}/to/{stage}', [ProjectController::class, 'drop'])->name('drop');
    
});


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
