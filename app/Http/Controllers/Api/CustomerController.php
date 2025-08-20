<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customer;

class CustomerController extends Controller
{
	public function index(Request $request)
	{
		$search = $request->get('search');
		$q = Customer::query();
		if ($search) {
			$q->where(function ($qb) use ($search) {
				$qb->where('name', 'like', "%{$search}%")
					->orWhere('phone', 'like', "%{$search}%")
					->orWhere('email', 'like', "%{$search}%");
			});
		}
		return response()->json($q->orderByDesc('id')->limit(50)->get());
	}

	public function store(Request $request)
	{
		$validated = $request->validate([
			'name' => 'required|string|max:255',
			'phone' => 'nullable|string|max:255',
			'email' => 'nullable|email|max:255',
			'notes' => 'nullable|string',
		]);
		$customer = Customer::create($validated);
		return response()->json($customer, 201);
	}
}


