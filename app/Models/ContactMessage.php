<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    protected $fillable = [
        'name',
        'phone',
        'email',
        'subject',
        'urgency',
        'appointment_type',
        'message',
        'status'
    ];

    protected $casts = [
        'urgency' => 'string',
        'appointment_type' => 'string',
    ];

    /**
     * Scope to get only unread messages
     */
    public function scopeUnread($query)
    {
        return $query->where('status', 'unread');
    }

    /**
     * Scope to get only read messages
     */
    public function scopeRead($query)
    {
        return $query->where('status', 'read');
    }

    /**
     * Scope to get only replied messages
     */
    public function scopeReplied($query)
    {
        return $query->where('status', 'replied');
    }
}
