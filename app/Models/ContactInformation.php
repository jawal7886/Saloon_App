<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactInformation extends Model
{
    protected $fillable = [
        'business_name',
        'address',
        'phone',
        'email',
        'website',
        'business_hours',
        'additional_info'
    ];

    protected $casts = [
        'business_hours' => 'array',
    ];

    /**
     * Get the default contact information (first record or create new one)
     */
    public static function getDefault()
    {
        $contactInfo = static::first();
        
        if (!$contactInfo) {
            // Create a new record with empty values if none exists
            $contactInfo = static::create([
                'business_name' => '',
                'address' => '',
                'phone' => '',
                'email' => '',
                'website' => '',
                'business_hours' => [
                    'monday' => '',
                    'tuesday' => '',
                    'wednesday' => '',
                    'thursday' => '',
                    'friday' => '',
                    'saturday' => '',
                    'sunday' => ''
                ],
                'additional_info' => ''
            ]);
        }
        
        return $contactInfo;
    }
} 