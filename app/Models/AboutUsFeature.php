<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AboutUsFeature extends Model
{
    use HasFactory;

    protected $table = 'about_us_features';

    protected $fillable = [
        'title',
        'description',
        'sort_order',
    ];
}