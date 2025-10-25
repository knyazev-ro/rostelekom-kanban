<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Project extends Model
{
    /** @use HasFactory<\Database\Factories\ProjectFactory> */
    use HasFactory, LogsActivity;
    protected $fillable = [
        'name',
        'description',
        'segment_id',
        'manager_id',
        'payment_type_id',
        'service_id',
        'stage_id',
        'date_series_id',
        'date',
        'client',
        'project_number',
        'stage_changed_at',
        'eval_id',
    ];

    protected $casts = [
        'date' => 'date',
        'stage_changed_at' => 'datetime',
    ];

    public function eval():BelongsTo {
        return $this->belongsTo(Evaluation::class, 'eval_id');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logOnlyDirty();
    }

    public function segment(): BelongsTo
    {
        return $this->belongsTo(Segment::class);
    }

    public function manager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    public function paymentType(): BelongsTo
    {
        return $this->belongsTo(PaymentType::class);
    }

    public function stage(): BelongsTo
    {
        return $this->belongsTo(Stage::class);
    }

    public function dateSeries(): HasOne
    {
        return $this->hasOne(DateSeries::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    protected static function booted() {
        static::updated(function (Project $project) {
            if($project->isDirty('stage_id')) {
                ProjectStageDuration::create([
                    'project_id' => $project->id,
                    'stage_id'=> $project->getOriginal('stage_id'),
                    'stayed_from' => $project->getOriginal('stage_changed_at') ?? now()->subMinute(),
                    'stayed_to' => now(),
                ]);
            }

        });
    }
}
