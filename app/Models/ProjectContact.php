<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectContact extends Model
{
    /** @use HasFactory<\Database\Factories\ProjectContactFactory> */
    use HasFactory;
    protected $fillable = [
        'contact_id',
        'project_id',
    ];
}
