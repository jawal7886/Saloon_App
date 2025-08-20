<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Barber extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'position',
        'bio',
        'image',
        'experience',
        'specialties',
        'phone',
        'email',
        'social_media',
        'is_active',
        'sort_order',
        'salon_id'
    ];

    protected $casts = [
        'specialties' => 'array',
        'social_media' => 'array',
        'is_active' => 'boolean',
        'sort_order' => 'integer'
    ];

    protected $hidden = [
        'image_data',
    ];

    protected $attributes = [
        'is_active' => true,
        'sort_order' => 0,
    ];

    /**
     * Get the salon that owns the barber.
     */
    public function salon(): BelongsTo
    {
        return $this->belongsTo(Salon::class);
    }

    /**
     * Scope a query to only include active barbers.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to order barbers by sort order.
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    /**
     * Get barbers for a specific salon.
     */
    public function scopeForSalon(Builder $query, $salonId): Builder
    {
        return $query->where('salon_id', $salonId);
    }

    /**
     * Set the specialties attribute.
     */
    public function setSpecialtiesAttribute($value)
    {
        if (is_string($value)) {
            $this->attributes['specialties'] = json_encode([$value]);
        } elseif (is_array($value)) {
            $this->attributes['specialties'] = json_encode($value);
        } else {
            $this->attributes['specialties'] = json_encode([]);
        }
    }

    /**
     * Get the specialties as a comma-separated string.
     */
    public function getSpecialtiesStringAttribute(): string
    {
        if (empty($this->specialties)) {
            return '';
        }
        return implode(', ', $this->specialties);
    }

    /**
     * Get the full name with position.
     */
    public function getFullNameWithPositionAttribute(): string
    {
        if ($this->position) {
            return "{$this->name} - {$this->position}";
        }
        return $this->name;
    }

    /**
     * Check if barber has a profile image.
     */
    public function hasImage(): bool
    {
        return !empty($this->image);
    }

    /**
     * Get the profile image URL or default image.
     */
    public function getImageUrlAttribute(): string
    {
        if (!empty($this->image_data)) {
            return $this->image_data; // base64 data URL
        }
        if (!empty($this->image)) {
            return $this->image;
        }
        return asset('assets/default-barber.jpg');
    }

    // Accessor: expose `image` as base64 if present in image_data
    public function getImageAttribute($value): ?string
    {
        if (!empty($this->attributes['image_data'])) {
            return $this->attributes['image_data'];
        }
        return $value;
    }

    // Mutator: when setting image, if base64 data URL -> store in image_data
    public function setImageAttribute($value): void
    {
        if (is_string($value) && str_starts_with($value, 'data:image')) {
            $this->attributes['image_data'] = $value;
            $this->attributes['image'] = null;
        } else {
            $this->attributes['image'] = $value;
        }
    }

    /**
     * Get social media links as array.
     */
    public function getSocialMediaLinksAttribute(): array
    {
        return $this->social_media ?? [];
    }

    /**
     * Check if barber has contact information.
     */
    public function hasContactInfo(): bool
    {
        return !empty($this->phone) || !empty($this->email);
    }

    /**
     * Get contact information as array.
     */
    public function getContactInfoAttribute(): array
    {
        return [
            'phone' => $this->phone,
            'email' => $this->email,
        ];
    }
}
