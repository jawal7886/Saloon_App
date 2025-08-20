<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    protected $table = 'gallery';

    protected $fillable = [
        'image_path',
        'category',
        'title',
        'description',
        'is_active',
        'sort_order'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer'
    ];

    // Categories available for gallery items
    public static $categories = [
        'Haircuts' => 'Haircuts',
        'Beard' => 'Beard',
        'Interior' => 'Interior',
        'Team' => 'Team',
        'Transformations' => 'Transformations'
    ];

    // Get the full URL for the image
    public function getImageUrlAttribute()
    {
        return asset('storage/' . $this->image_path);
    }

    // Scope to get active items
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Scope to get items by category
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    // Scope to order by sort_order
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order', 'asc')->orderBy('created_at', 'desc');
    }
}
