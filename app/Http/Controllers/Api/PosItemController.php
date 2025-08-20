<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Service;

class PosItemController extends Controller
{
	public function index(Request $request)
	{
		$search = $request->get('search');

		$query = Service::query()->where('is_active', true);
		if ($search) {
			$query->where(function ($q) use ($search) {
				$q->where('name', 'like', "%{$search}%")
					->orWhere('category', 'like', "%{$search}%");
			});
		}

		$services = $query->limit(50)->get(['id','name','price','duration','category']);

		return response()->json($services->map(function ($s) {
			return [
				'id' => $s->id,
				'type' => 'service',
				'name' => $s->name,
				'price' => (float)$s->price,
				'category' => $s->category,
				'duration' => $s->duration,
			];
		}));
	}
}


