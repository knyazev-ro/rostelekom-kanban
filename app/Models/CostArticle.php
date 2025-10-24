<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CostArticle extends Model
{
    /** @use HasFactory<\Database\Factories\CostArticleFactory> */
    use HasFactory;
    protected $fillable = [
        'name',
    ];
}
