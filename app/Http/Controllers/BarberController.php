<?php

namespace App\Http\Controllers;

use App\Models\Barber;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class BarberController extends Controller
{
    /**
     * Display a listing of the barbers.
     */
    public function index(Request $request)
    {
        $barbers = Barber::orderBy('sort_order')->get();
        
        if ($request->expectsJson()) {
            return response()->json($barbers);
        }
        
        return view('admin.barbers.index', compact('barbers'));
    }

    /**
     * Store a newly created barber in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'title' => 'nullable|string|max:255', // React sends 'title' instead of 'position'
            'position' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'image' => 'nullable|string',
            'experience' => 'nullable|string|max:255',
            'specialty' => 'nullable|string|max:255', // React sends 'specialty' as single string
            'specialties' => 'nullable|array',
            'specialties.*' => 'string',
            'phone' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'social_media' => 'nullable|array',
            'isActive' => 'boolean', // React sends 'isActive' instead of 'is_active'
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'salon_id' => 'nullable|exists:salons,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Process the data to match database fields
        $data = $request->all();
        
        // Map React fields to database fields
        if (isset($data['title'])) {
            $data['position'] = $data['title'];
        }
        
        if (isset($data['isActive'])) {
            $data['is_active'] = $data['isActive'];
        }
        
        // Handle specialty field - convert to specialties array
        if (isset($data['specialty']) && !isset($data['specialties'])) {
            $data['specialties'] = [$data['specialty']];
        }
        
        // Filter out non-database fields
        $data = array_intersect_key($data, array_flip([
            'name', 'position', 'bio', 'image', 'experience', 'specialties',
            'phone', 'email', 'social_media', 'is_active', 'sort_order', 'salon_id'
        ]));

        $barber = Barber::create($data);
        
        return response()->json($barber, 201);
    }

    /**
     * Display the specified barber.
     */
    public function show(Request $request, Barber $barber)
    {
        if ($request->expectsJson()) {
            return response()->json($barber);
        }
        
        return view('admin.barbers.show', compact('barber'));
    }

    /**
     * Update the specified barber in storage.
     */
    public function update(Request $request, Barber $barber)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'title' => 'nullable|string|max:255', // React sends 'title' instead of 'position'
            'position' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'image' => 'nullable|string',
            'experience' => 'nullable|string|max:255',
            'specialty' => 'nullable|string|max:255', // React sends 'specialty' as single string
            'specialties' => 'nullable|array',
            'specialties.*' => 'string',
            'phone' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'social_media' => 'nullable|array',
            'isActive' => 'boolean', // React sends 'isActive' instead of 'is_active'
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'salon_id' => 'nullable|exists:salons,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Process the data to match database fields
        $data = $request->all();
        
        // Map React fields to database fields
        if (isset($data['title'])) {
            $data['position'] = $data['title'];
        }
        
        if (isset($data['isActive'])) {
            $data['is_active'] = $data['isActive'];
        }
        
        // Handle specialty field - convert to specialties array
        if (isset($data['specialty']) && !isset($data['specialties'])) {
            $data['specialties'] = [$data['specialty']];
        }
        
        // Filter out non-database fields
        $data = array_intersect_key($data, array_flip([
            'name', 'position', 'bio', 'image', 'experience', 'specialties',
            'phone', 'email', 'social_media', 'is_active', 'sort_order', 'salon_id'
        ]));

        $barber->update($data);
        
        return response()->json($barber);
    }

    /**
     * Remove the specified barber from storage.
     */
    public function destroy(Request $request, Barber $barber)
    {
        $barber->delete();
        
        if ($request->expectsJson()) {
            return response()->json(['message' => 'Barber deleted successfully']);
        }
        
        return redirect()->route('admin.barbers.index')->with('success', 'Barber deleted successfully!');
    }
}
