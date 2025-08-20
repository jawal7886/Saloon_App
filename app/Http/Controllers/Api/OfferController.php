<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Offer;

class OfferController extends Controller
{
    // GET /api/offers
    public function index()
    {
        $offers = Offer::where('is_active', true)
                      ->orderBy('sort_order')
                      ->get();
        return response()->json($offers);
    }

    // GET /api/offers/{id}
    public function show($id)
    {
        $offer = Offer::find($id);
        if (!$offer) {
            return response()->json(['error' => 'Offer not found'], 404);
        }
        return response()->json($offer);
    }

    // POST /api/offers
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'original_price' => 'required|numeric|min:0',
            'discounted_price' => 'required|numeric|min:0',
            'discount_percentage' => 'required|integer|min:0|max:100',
            'is_popular' => 'boolean',
            'features' => 'required|array',
            'features.*' => 'string',
            'duration' => 'required|string|max:255',
            'sort_order' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        $offer = Offer::create($request->all());
        return response()->json($offer, 201);
    }

    // PUT /api/offers/{id}
    public function update(Request $request, $id)
    {
        $offer = Offer::find($id);
        if (!$offer) {
            return response()->json(['error' => 'Offer not found'], 404);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'original_price' => 'required|numeric|min:0',
            'discounted_price' => 'required|numeric|min:0',
            'discount_percentage' => 'required|integer|min:0|max:100',
            'is_popular' => 'boolean',
            'features' => 'required|array',
            'features.*' => 'string',
            'duration' => 'required|string|max:255',
            'sort_order' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        $offer->update($request->all());
        return response()->json($offer);
    }

    // DELETE /api/offers/{id}
    public function destroy($id)
    {
        $offer = Offer::find($id);
        if (!$offer) {
            return response()->json(['error' => 'Offer not found'], 404);
        }

        $offer->delete();
        return response()->json(['message' => 'Offer deleted successfully']);
    }
} 