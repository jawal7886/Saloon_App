<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AboutUs;
use App\Models\AboutUsFeature;

class AboutUsController extends Controller
{
    // GET /api/aboutus
    public function show()
    {
        $about = AboutUs::first();
        return response()->json($about);
    }

    // GET /api/aboutus/all (optional, for listing all entries)
    public function index()
    {
        return response()->json(AboutUs::all());
    }

    // PUT /api/aboutus
    public function update(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:about_us,id',
            'heading' => 'required|string|max:255',
            'paragraph' => 'required|string'
        ]);

        $about = AboutUs::find($request->input('id'));
        if (!$about) {
            return response()->json(['error' => 'About Us record not found'], 404);
        }

        $about->update([
            'heading' => $request->input('heading'),
            'paragraph' => $request->input('paragraph')
        ]);

        return response()->json($about);
    }

    // PUT /api/aboutus/{id} - Update specific record by ID
    public function updateById(Request $request, $id)
    {
        $request->validate([
            'heading' => 'required|string|max:255',
            'paragraph' => 'required|string'
        ]);

        $about = AboutUs::find($id);
        if (!$about) {
            return response()->json(['error' => 'About Us record not found'], 404);
        }

        $about->update([
            'heading' => $request->input('heading'),
            'paragraph' => $request->input('paragraph')
        ]);

        return response()->json($about);
    }

    // POST /api/aboutus
    public function store(Request $request)
    {
        $about = AboutUs::create([
            'heading' => $request->input('heading'),
            'paragraph' => $request->input('paragraph'),
        ]);
        return response()->json($about, 201);
    }

    // DELETE /api/aboutus/{id}
    public function destroy($id)
    {
        $about = AboutUs::find($id);
        if (!$about) {
            return response()->json(['error' => 'About Us record not found'], 404);
        }
        $about->delete();
        return response()->json(['message' => 'About Us record deleted successfully']);
    }

    // GET /api/aboutus/features
    public function features()
    {
        $features = AboutUsFeature::orderBy('sort_order')->get(['title', 'description']);
        return response()->json($features);
    }

    // POST /api/aboutus/features
    public function storeFeature(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'sort_order' => 'required|integer|min:0'
        ]);

        $feature = AboutUsFeature::create([
            'title' => $request->title,
            'description' => $request->description,
            'sort_order' => $request->sort_order
        ]);

        return response()->json($feature, 201);
    }

    // PUT /api/aboutus/features/{id}
    public function updateFeature(Request $request, $id)
    {
        $feature = AboutUsFeature::find($id);
        if (!$feature) {
            return response()->json(['error' => 'Feature not found'], 404);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'sort_order' => 'required|integer|min:0'
        ]);

        $feature->update([
            'title' => $request->title,
            'description' => $request->description,
            'sort_order' => $request->sort_order
        ]);

        return response()->json($feature);
    }

    // DELETE /api/aboutus/features/{id}
    public function destroyFeature($id)
    {
        $feature = AboutUsFeature::find($id);
        if (!$feature) {
            return response()->json(['error' => 'Feature not found'], 404);
        }

        $feature->delete();
        return response()->json(['message' => 'Feature deleted successfully']);
    }
}