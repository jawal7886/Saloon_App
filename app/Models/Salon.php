<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Salon extends Model
{
    protected $fillable = [
        'name',
        'tag_line',
        'logo',
        'address',
        'phone1',
        'phone2',
        'email1',
        'email2',
        'description',
        'social_media',
        'hours',
    ];

    /**
     * Get the services for the salon.
     */
    public function services(): HasMany
    {
        return $this->hasMany(Service::class);
    }

    /**
     * Get the barbers for the salon.
     */
    public function barbers(): HasMany
    {
        return $this->hasMany(Barber::class);
    }
}
