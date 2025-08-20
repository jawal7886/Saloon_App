<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Log the user in after registration
        Auth::login($user);

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
            'authenticated' => true
        ], 201);
    }

    /**
     * Login user
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (Auth::attempt($request->only('email', 'password'))) {
            $user = Auth::user();
            
            return response()->json([
                'message' => 'Login successful',
                'user' => $user,
                'authenticated' => true
            ]);
        }

        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        Auth::logout();
        
        return response()->json([
            'message' => 'Logged out successfully',
            'authenticated' => false
        ]);
    }

    /**
     * Get current user
     */
    public function user(Request $request)
    {
        return response()->json([
            'user' => Auth::user(),
            'authenticated' => Auth::check()
        ]);
    }
}
