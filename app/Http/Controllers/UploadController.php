<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function uploadLogo(Request $request)
    {
        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            // Store on the PUBLIC disk so it's served via /storage symlink
            $path = $file->store('logos', 'public');
            $url = Storage::disk('public')->url($path);
            return response()->json(['url' => $url]);
        }
        return response()->json(['error' => 'No file uploaded'], 400);
    }
}