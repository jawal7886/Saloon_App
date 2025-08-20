<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Service extends Model
{
    protected $fillable = [
        'name',
        'description',
        'price',
        'duration',
        'category',
        'image',
        'is_active',
        'salon_id',
        'image_data',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    protected $hidden = [
        'image_data',
    ];

    /**
     * Get the salon that owns the service.
     */
    public function salon(): BelongsTo
    {
        return $this->belongsTo(Salon::class);
    }

    /**
     * Accessor for isActive (camelCase)
     */
    public function getIsActiveAttribute($value): bool
    {
        return (bool) $value;
    }

    /**
     * Mutator for isActive (camelCase)
     */
    public function setIsActiveAttribute($value): void
    {
        $this->attributes['is_active'] = (bool) $value;
    }

    /**
     * Mutator: when setting image, accept a base64 data URL and store it in image_data if it's long.
     */
    public function setImageAttribute($value): void
    {
        if (is_string($value) && str_starts_with($value, 'data:image')) {
            $this->attributes['image_data'] = $value;
            // Keep image column null to avoid length issues
            $this->attributes['image'] = null;
        } else {
            $this->attributes['image'] = $value;
        }
    }

    /**
     * Accessor: prefer image_data (base64) if present; otherwise return image URL/path.
     */
    public function getImageAttribute($value): ?string
    {
        if (!empty($this->attributes['image_data'])) {
            return $this->attributes['image_data'];
        }
        return $value;
    }

    /**
     * Scope to get only active services
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get only inactive services
     */
    public function scopeInactive($query)
    {
        return $query->where('is_active', false);
    }
}