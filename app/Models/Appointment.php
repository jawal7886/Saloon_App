<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array<int, string>
	 */
	protected $fillable = [
		'name',
		'email',
		'phone',
		'service',
		'appointment_date',
		'appointment_time',
		'barber',
		'notes',
	];

	/**
	 * The attributes that should be cast.
	 *
	 * @var array<string, string>
	 */
	protected $casts = [
		'appointment_date' => 'date',
		'appointment_time' => 'datetime:H:i',
	];
}
