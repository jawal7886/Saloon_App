<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class GalleryController extends Controller
{
    /**
     * Test method to check database connection and table structure.
     */
    public function test()
    {
        try {
            // Check if table exists
            $tableExists = \Schema::hasTable('gallery');
            
            // Check table structure
            $columns = [];
            if ($tableExists) {
                $columns = \Schema::getColumnListing('gallery');
            }
            
            // Try to create a test record
            $testRecord = null;
            if ($tableExists) {
                $testRecord = Gallery::create([
                    'image_path' => 'test.jpg',
                    'category' => 'Test',
                    'title' => 'Test Item',
                    'description' => 'Test Description',
                    'is_active' => true,
                    'sort_order' => 0
                ]);
            }
            
            return response()->json([
                'success' => true,
                'table_exists' => $tableExists,
                'columns' => $columns,
                'test_record_created' => $testRecord ? true : false,
                'test_record_id' => $testRecord ? $testRecord->id : null
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'table_exists' => \Schema::hasTable('gallery')
            ], 500);
        }
    }

    /**
     * Display a listing of gallery items.
     */
    public function index()
    {
        $galleryItems = Gallery::orderBy('sort_order')->get();
        
        return response()->json([
            'success' => true,
            'data' => $galleryItems
        ]);
    }

    /**
     * Store a newly created gallery item.
     */
    public function store(Request $request)
    {
        // Debug: Log the incoming request
        \Log::info('Gallery store request received', [
            'all_data' => $request->all(),
            'has_file' => $request->hasFile('image'),
            'files' => $request->file(),
            'content_type' => $request->header('Content-Type'),
            'request_method' => $request->method()
        ]);

        // Check if image file exists in request
        if (!$request->hasFile('image')) {
            \Log::error('No image file found in request', [
                'files' => $request->file(),
                'all_data' => $request->all()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'No image file uploaded. Please select an image.',
                'debug' => [
                    'has_file' => $request->hasFile('image'),
                    'files_count' => count($request->file()),
                    'content_type' => $request->header('Content-Type')
                ]
            ], 422);
        }

        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'category' => 'required|string|max:255',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'nullable|in:true,false,0,1',
            'sort_order' => 'nullable|integer'
        ]);

        if ($validator->fails()) {
            \Log::error('Gallery validation failed', $validator->errors()->toArray());
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Handle image upload
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $imagePath = $image->storeAs('gallery', $imageName, 'public');
            
            \Log::info('Image uploaded successfully', [
                'original_name' => $image->getClientOriginalName(),
                'stored_path' => $imagePath,
                'file_size' => $image->getSize()
            ]);

            $galleryItem = Gallery::create([
                'image_path' => $imagePath,
                'category' => $request->category,
                'title' => $request->title,
                'description' => $request->description,
                'is_active' => filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN),
                'sort_order' => intval($request->input('sort_order', 0))
            ]);

            return response()->json([
                'success' => true,
                'data' => $galleryItem,
                'message' => 'Gallery item created successfully'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating gallery item: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified gallery item.
     */
    public function show($id)
    {
        $galleryItem = Gallery::find($id);
        
        if (!$galleryItem) {
            return response()->json([
                'success' => false,
                'message' => 'Gallery item not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $galleryItem
        ]);
    }

    /**
     * Update the specified gallery item.
     */
    public function update(Request $request, $id)
    {
        $galleryItem = Gallery::find($id);
        
        if (!$galleryItem) {
            return response()->json([
                'success' => false,
                'message' => 'Gallery item not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'category' => 'required|string|max:255',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'nullable|in:true,false,0,1',
            'sort_order' => 'nullable|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $updateData = [
                'category' => $request->category,
                'title' => $request->title,
                'description' => $request->description,
                'is_active' => filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN),
                'sort_order' => intval($request->input('sort_order', 0))
            ];

            // Handle image upload if new image is provided
            if ($request->hasFile('image')) {
                // Delete old image
                if ($galleryItem->image_path && Storage::disk('public')->exists($galleryItem->image_path)) {
                    Storage::disk('public')->delete($galleryItem->image_path);
                }

                // Upload new image
                $image = $request->file('image');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $imagePath = $image->storeAs('gallery', $imageName, 'public');
                $updateData['image_path'] = $imagePath;
            }

            $galleryItem->update($updateData);

            return response()->json([
                'success' => true,
                'data' => $galleryItem,
                'message' => 'Gallery item updated successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating gallery item: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified gallery item.
     */
    public function destroy($id)
    {
        $galleryItem = Gallery::find($id);
        
        if (!$galleryItem) {
            return response()->json([
                'success' => false,
                'message' => 'Gallery item not found'
            ], 404);
        }

        try {
            // Delete image file
            if ($galleryItem->image_path && Storage::disk('public')->exists($galleryItem->image_path)) {
                Storage::disk('public')->delete($galleryItem->image_path);
            }

            $galleryItem->delete();

            return response()->json([
                'success' => true,
                'message' => 'Gallery item deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting gallery item: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get gallery items by category.
     */
    public function getByCategory($category)
    {
        $galleryItems = Gallery::where('category', $category)
                              ->where('is_active', true)
                              ->orderBy('sort_order')
                              ->get();

        return response()->json([
            'success' => true,
            'data' => $galleryItems
        ]);
    }

    /**
     * Get only active gallery items.
     */
    public function getActive()
    {
        $galleryItems = Gallery::where('is_active', true)
                              ->orderBy('sort_order')
                              ->get();

        return response()->json([
            'success' => true,
            'data' => $galleryItems
        ]);
    }

    /**
     * Get all available categories.
     */
    public function getCategories()
    {
        $categories = Gallery::select('category')
                           ->distinct()
                           ->where('is_active', true)
                           ->pluck('category');

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    /**
     * Toggle the active status of a gallery item.
     */
    public function toggleStatus($id)
    {
        $galleryItem = Gallery::find($id);
        
        if (!$galleryItem) {
            return response()->json([
                'success' => false,
                'message' => 'Gallery item not found'
            ], 404);
        }

        $galleryItem->update(['is_active' => !$galleryItem->is_active]);

        return response()->json([
            'success' => true,
            'data' => $galleryItem,
            'message' => 'Status updated successfully'
        ]);
    }

    /**
     * Reorder gallery items.
     */
    public function reorder(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer|exists:gallery,id',
            'items.*.sort_order' => 'required|integer|min:0'
        ]);

        foreach ($request->items as $item) {
            Gallery::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Order updated successfully'
        ]);
    }

    /**
     * Bulk upload gallery items.
     */
    public function bulkUpload(Request $request)
    {
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'category' => 'required|string|max:255',
            'title_prefix' => 'nullable|string|max:255'
        ]);

        $uploadedItems = [];
        $errors = [];

        foreach ($request->file('images') as $index => $image) {
            try {
                $imageName = time() . '_' . $index . '_' . $image->getClientOriginalName();
                $imagePath = $image->storeAs('gallery', $imageName, 'public');

                $title = $request->title_prefix ? $request->title_prefix . ' ' . ($index + 1) : 'Gallery Item ' . ($index + 1);

                $galleryItem = Gallery::create([
                    'image_path' => $imagePath,
                    'category' => $request->category,
                    'title' => $title,
                    'description' => '',
                    'is_active' => true,
                    'sort_order' => Gallery::max('sort_order') + $index + 1
                ]);

                $uploadedItems[] = $galleryItem;
            } catch (\Exception $e) {
                $errors[] = "Failed to upload image " . ($index + 1) . ": " . $e->getMessage();
            }
        }

        return response()->json([
            'success' => count($errors) === 0,
            'data' => $uploadedItems,
            'errors' => $errors,
            'message' => count($uploadedItems) . ' items uploaded successfully'
        ]);
    }
} 