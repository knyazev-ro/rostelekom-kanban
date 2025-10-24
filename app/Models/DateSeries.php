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
    ];

    // protected $attributes = [
    //     'year' => now()->year,
    //     'january' => $this->cell,
    //     'february' => $this->cell,
    //     'march' => $this->cell,
    //     'april' => $this->cell,
    //     'may' => $this->cell,
    //     'june' => $this->cell,
    //     'july' => $this->cell,
    //     'august' => $this->cell,
    //     'september' => $this->cell,
    //     'october' => $this->cell,
    //     'november' => $this->cell,
    //     'december' => $this->cell,
    //     'total' => 0,
    // ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

}
