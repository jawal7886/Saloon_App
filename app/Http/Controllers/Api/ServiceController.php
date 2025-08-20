<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Service;
use Illuminate\Support\Facades\Log;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $services = Service::all();
            return response()->json($services);
        } catch (\Exception $e) {
            Log::error('Error fetching services: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch services'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            Log::info('Create service request', [
                'data' => $request->all(),
                'method' => $request->method()
            ]);
            
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'price' => 'required|numeric|min:0',
                'duration' => 'required|string|max:255',
                'category' => 'required|string|max:255',
                'image' => 'nullable|string',
                'is_active' => 'boolean',
                'salon_id' => 'required|exists:salons,id',
            ]);

            // Ensure is_active is boolean
            if (isset($data['is_active'])) {
                $data['is_active'] = (bool) $data['is_active'];
            } else {
                $data['is_active'] = true; // Default to active
            }

            // Check if salon exists
            $salon = \App\Models\Salon::find($data['salon_id']);
            if (!$salon) {
                return response()->json(['error' => 'Salon not found'], 404);
            }

            $service = Service::create($data);
            
            Log::info('Service created successfully', [
                'service_id' => $service->id, 
                'service_name' => $service->name,
                'salon_id' => $service->salon_id
            ]);
            
            return response()->json([
                'message' => 'Service created successfully',
                'service' => $service->fresh()
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error: ' . $e->getMessage());
            return response()->json(['error' => 'Validation failed', 'details' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error creating service: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create service: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $service = Service::findOrFail($id);
            return response()->json($service);
        } catch (\Exception $e) {
            Log::error('Error fetching service: ' . $e->getMessage());
            return response()->json(['error' => 'Service not found'], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            Log::info('Update service request', [
                'id' => $id,
                'data' => $request->all(),
                'method' => $request->method()
            ]);
            
            $service = Service::findOrFail($id);
            
            // Handle partial updates - only validate fields that are present
            $validationRules = [];
            $updateData = [];
            
            if ($request->has('name')) {
                $validationRules['name'] = 'required|string|max:255';
                $updateData['name'] = $request->name;
            }
            
            if ($request->has('description')) {
                $validationRules['description'] = 'nullable|string';
                $updateData['description'] = $request->description;
            }
            
            if ($request->has('price')) {
                $validationRules['price'] = 'required|numeric|min:0';
                $updateData['price'] = $request->price;
            }
            
            if ($request->has('duration')) {
                $validationRules['duration'] = 'required|string|max:255';
                $updateData['duration'] = $request->duration;
            }
            
            if ($request->has('category')) {
                $validationRules['category'] = 'required|string|max:255';
                $updateData['category'] = $request->category;
            }
            
            if ($request->has('image')) {
                $validationRules['image'] = 'nullable|string';
                $updateData['image'] = $request->image;
            }
            
            if ($request->has('is_active')) {
                $validationRules['is_active'] = 'boolean';
                $updateData['is_active'] = $request->boolean('is_active');
            }
            
            if ($request->has('salon_id')) {
                $validationRules['salon_id'] = 'exists:salons,id';
                $updateData['salon_id'] = $request->salon_id;
            }
            
            // Validate only the fields that are being updated
            if (!empty($validationRules)) {
                $request->validate($validationRules);
            }
            
            // Update only the provided fields
            if (!empty($updateData)) {
                $service->update($updateData);
            }
            
            Log::info('Service updated successfully', ['service_id' => $service->id]);
            return response()->json([
                'message' => 'Service updated successfully',
                'service' => $service->fresh()
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Service not found: ' . $id);
            return response()->json(['error' => 'Service not found'], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error: ' . $e->getMessage());
            return response()->json(['error' => 'Validation failed', 'details' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error updating service: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update service'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            Log::info('Delete service request', ['id' => $id]);
            
            $service = Service::findOrFail($id);
            $serviceName = $service->name; // Store name before deletion for logging
            $service->delete();
            
            Log::info('Service deleted successfully', ['service_id' => $id, 'service_name' => $serviceName]);
            return response()->json([
                'message' => 'Service deleted successfully',
                'deleted_service_id' => $id
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Service not found for deletion: ' . $id);
            return response()->json(['error' => 'Service not found'], 404);
        } catch (\Exception $e) {
            Log::error('Error deleting service: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete service'], 500);
        }
    }
} 