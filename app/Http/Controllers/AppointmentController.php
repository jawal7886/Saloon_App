<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
	/**
	 * Display a listing of the appointments.
	 */
	public function index(Request $request)
	{
		$query = Appointment::query();

		// Optional simple filters
		if ($search = $request->get('search')) {
			$query->where(function ($q) use ($search) {
				$q->where('name', 'like', "%{$search}%")
					->orWhere('email', 'like', "%{$search}%")
					->orWhere('phone', 'like', "%{$search}%")
					->orWhere('service', 'like', "%{$search}%")
					->orWhere('barber', 'like', "%{$search}%");
			});
		}
		if ($date = $request->get('date')) {
			$query->whereDate('appointment_date', $date);
		}

		$appointments = $query->orderByDesc('appointment_date')
			->orderByDesc('appointment_time')
			->paginate(20);

		return response()->json($appointments);
	}
	/**
	 * Store a newly created appointment in storage.
	 */
	public function store(Request $request)
	{
		$validated = $request->validate([
			'name' => 'required|string|max:255',
			'email' => 'required|email|max:255',
			'phone' => 'required|string|max:50',
			'service' => 'required|string|max:255',
			'appointment_date' => 'required|date|after_or_equal:today',
			'appointment_time' => 'required|date_format:H:i',
			'barber' => 'required|string|max:255',
			'notes' => 'nullable|string',
		]);

		$alreadyBooked = Appointment::where('barber', $validated['barber'])
			->where('appointment_date', $validated['appointment_date'])
			->where('appointment_time', $validated['appointment_time'])
			->exists();

		if ($alreadyBooked) {
			$errors = ['appointment_time' => 'This time slot is no longer available for the selected barber.'];
			if ($request->wantsJson()) {
				return response()->json(['message' => 'Time slot unavailable', 'errors' => $errors], 422);
			}
			return back()->withErrors($errors)->withInput();
		}

		$appointment = Appointment::create($validated);

		if ($request->wantsJson()) {
			return response()->json([
				'message' => 'Appointment booked successfully',
				'data' => $appointment,
			], 201);
		}

		return redirect()->back()->with('success', 'Appointment booked successfully.');
	}
}
