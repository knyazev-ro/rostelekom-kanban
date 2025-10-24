<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Probability extends Model
{
    /** @use HasFactory<\Database\Factories\ProbabilityFactory> */
    use HasFactory;
    protected $fillable = [
        'probability',
    ];
}
