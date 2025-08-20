<?php


use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\SalonController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\BarberController;
use App\Http\Controllers\AppointmentController;


Route::get('/', function () {
    return view('welcome');
});

Route::get('/debugbar-test', function () {
    \Barryvdh\Debugbar\Facades\Debugbar::info('This is a test message');
    return view('debugbar-test');
});


// Salon routes
Route::apiResource('salons', SalonController::class);


// Authentication routes
Route::group(['prefix' => 'auth'], function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
});


Route::post('/upload-logo', [UploadController::class, 'uploadLogo']);
// Service routes - Remove this line as it's already in api.php
// Route::apiResource('services', ServiceController::class);


// Admin Barber Management Routes
// (Moved to api.php)


// Test route for API verification (remove in production)
Route::get('/test-services', function () {
    $salon = \App\Models\Salon::first();
    $services = \App\Models\Service::all();
   
    return response()->json([
        'message' => 'Service API is working',
        'salon' => $salon ? [
            'id' => $salon->id,
            'name' => $salon->name
        ] : null,
        'services_count' => $services->count(),
        'endpoints' => [
            'GET /api/services' => 'List all services',
            'POST /api/services' => 'Create new service',
            'GET /api/services/{id}' => 'Get specific service',
            'PUT /api/services/{id}' => 'Update service',
            'DELETE /api/services/{id}' => 'Delete service'
        ]
    ]);
});

// Appointment routes
Route::post('/appointments', [AppointmentController::class, 'store'])->name('appointments.store');







