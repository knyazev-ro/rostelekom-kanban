<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DateSeries extends Model
{
    /** @use HasFactory<\Database\Factories\DateSeriesFactory> */
    use HasFactory;
    protected $fillable = [
        'year',
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
        'project_id',
        'total',
    ];

    protected $casts = [
        'january' => 'array',
        'february' => 'array',
        'march' => 'array',
        'april' => 'array',
        'may' => 'array',
        'june' => 'array',
        'july' => 'array',
        'august' => 'array',
        'september' => 'array',
        'october' => 'array',
        'november' => 'array',
        'december' => 'array',
    ];

    protected $cell = [
        'value' => 0,
        'status' => null,
        'cost' => 0,
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

}
