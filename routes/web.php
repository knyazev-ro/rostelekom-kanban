<?php

use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\DashboardController;
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


Route::prefix('board')->name('board')->group(function () {
    Route::get('/', [DashboardController::class,'index'])->name('index');
});


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::prefix('projects')->name('projects.')->group(function () {
    Route::get('/', [ProjectController::class, 'index'])->name('index');
    Route::get('/create', [ProjectController::class, 'create'])->name('create');
    Route::get('/show', [ProjectController::class, 'show'])->name('show');
    Route::post('/update/{id?}', [ProjectController::class, 'update'])->name('update');
});

Route::prefix('users')->name('users.')->group(function () {
    Route::get('/', [AdminUserController::class, 'index'])->name('index');
    Route::get('/create', [AdminUserController::class, 'create'])->name('create');
    Route::get('/edit/{user}', [AdminUserController::class, 'edit'])->name('edit');
    Route::post('/update/{id?}', [AdminUserController::class, 'update'])->name('update');
    Route::post('/delete/{user}', [AdminUserController::class, 'destory'])->name('delete');
});

require __DIR__ . '/settings.php';
