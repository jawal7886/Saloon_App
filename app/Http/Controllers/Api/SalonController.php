<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Salon;
use Illuminate\Support\Facades\Log;

class SalonController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Salon::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Debug logging
        Log::info('Salon store request received', [
            'has_logo' => $request->has('logo'),
            'logo_length' => $request->input('logo') ? strlen($request->input('logo')) : 0,
            'logo_preview' => $request->input('logo') ? substr($request->input('logo'), 0, 100) . '...' : 'null'
        ]);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'tag_line' => 'nullable|string|max:255',
            'logo' => 'nullable|string', // Allow base64 images (much larger than 255 chars)
            'address' => 'nullable|string|max:255',
            'phone1' => 'nullable|string|max:50',
            'phone2' => 'nullable|string|max:50',
            'email1' => 'nullable|email|max:255',
            'email2' => 'nullable|email|max:255',
            'description' => 'nullable|string',
            'social_media' => 'nullable|string',
            'hours' => 'nullable|string',
        ]);
        
        // Decode JSON strings if they exist
        if (isset($data['social_media']) && is_string($data['social_media'])) {
            $data['social_media'] = json_decode($data['social_media'], true);
        }
        if (isset($data['hours']) && is_string($data['hours'])) {
            $data['hours'] = json_decode($data['hours'], true);
        }
        
        // Encode back to JSON for storage
        if (isset($data['social_media'])) {
            $data['social_media'] = json_encode($data['social_media']);
        }
        if (isset($data['hours'])) {
            $data['hours'] = json_encode($data['hours']);
        }
        
        $salon = Salon::create($data);
        return response()->json($salon, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $salon = Salon::findOrFail($id);
        return response()->json($salon);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Debug logging
        Log::info('Salon update request received', [
            'id' => $id,
            'has_logo' => $request->has('logo'),
            'logo_length' => $request->input('logo') ? strlen($request->input('logo')) : 0,
            'logo_preview' => $request->input('logo') ? substr($request->input('logo'), 0, 100) . '...' : 'null'
        ]);

        $salon = Salon::findOrFail($id);
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'tag_line' => 'nullable|string|max:255',
            'logo' => 'nullable|string', // Allow base64 images (much larger than 255 chars)
            'address' => 'nullable|string|max:255',
            'phone1' => 'nullable|string|max:50',
            'phone2' => 'nullable|string|max:50',
            'email1' => 'nullable|email|max:255',
            'email2' => 'nullable|email|max:255',
            'description' => 'nullable|string',
            'social_media' => 'nullable|string',
            'hours' => 'nullable|string',
        ]);
        
        // Decode JSON strings if they exist
        if (isset($data['social_media']) && is_string($data['social_media'])) {
            $data['social_media'] = json_decode($data['social_media'], true);
        }
        if (isset($data['hours']) && is_string($data['hours'])) {
            $data['hours'] = json_decode($data['hours'], true);
        }
        
        // Encode back to JSON for storage
        if (isset($data['social_media'])) {
            $data['social_media'] = json_encode($data['social_media']);
        }
        if (isset($data['hours'])) {
            $data['hours'] = json_encode($data['hours']);
        }
        
        $salon->update($data);
        return response()->json($salon);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $salon = Salon::findOrFail($id);
        $salon->delete();
        return response()->json(['message' => 'Salon deleted successfully']);
    }

    /**
     * Debug method to test logo storage
     */
    public function debugLogo(Request $request)
    {
        Log::info('Debug logo request', [
            'content_type' => $request->header('Content-Type'),
            'content_length' => $request->header('Content-Length'),
            'has_logo' => $request->has('logo'),
            'logo_length' => $request->input('logo') ? strlen($request->input('logo')) : 0,
            'logo_preview' => $request->input('logo') ? substr($request->input('logo'), 0, 100) . '...' : 'null'
        ]);

        return response()->json([
            'message' => 'Debug info logged',
            'logo_received' => $request->has('logo'),
            'logo_length' => $request->input('logo') ? strlen($request->input('logo')) : 0
        ]);
    }
}
