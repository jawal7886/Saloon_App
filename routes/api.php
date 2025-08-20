<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\SalonController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\BarberController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\Api\AboutUsController;
use App\Http\Controllers\Api\OfferController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\PosItemController;
use App\Http\Controllers\Api\PosSaleController;
use App\Http\Controllers\Api\CustomerController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Service API routes (no auth required for admin panel)
Route::apiResource('services', ServiceController::class);

// Salon API routes (no auth required for admin panel)
Route::apiResource('salons', SalonController::class);
Route::post('salons/debug-logo', [SalonController::class, 'debugLogo']);

// Barber API routes (no auth required for admin panel)
Route::apiResource('barbers', BarberController::class);

// Contact API routes
Route::post('/contact/message', [ContactController::class, 'storeMessage']);
Route::get('/contact/messages', [ContactController::class, 'getMessages']);
Route::put('/contact/messages/{id}/status', [ContactController::class, 'updateMessageStatus']);
Route::delete('/contact/messages/{id}', [ContactController::class, 'deleteMessage']);
Route::get('/contact/info', [ContactController::class, 'getContactInfo']);
Route::put('/contact/info', [ContactController::class, 'updateContactInfo']);

// About Us API routes
Route::get('/aboutus', [AboutUsController::class, 'show']);
Route::put('/aboutus', [AboutUsController::class, 'update']);
Route::post('/aboutus', [AboutUsController::class, 'store']);
Route::get('/aboutus/all', [AboutUsController::class, 'index']);
Route::delete('/aboutus/{id}', [AboutUsController::class, 'destroy']);
Route::get('/aboutus/features', [AboutUsController::class, 'features']);
Route::post('/aboutus/features', [AboutUsController::class, 'storeFeature']);
Route::put('/aboutus/features/{id}', [AboutUsController::class, 'updateFeature']);
Route::delete('/aboutus/features/{id}', [AboutUsController::class, 'destroyFeature']);
Route::put('/aboutus/{id}', [AboutUsController::class, 'updateById']);

// Offers API routes
Route::apiResource('offers', OfferController::class);

// Gallery API routes
Route::apiResource('gallery', \App\Http\Controllers\GalleryController::class);
Route::get('/gallery/category/{category}', [\App\Http\Controllers\GalleryController::class, 'getByCategory']);
Route::get('/gallery/test', [\App\Http\Controllers\GalleryController::class, 'test']);

// Additional Gallery APIs
Route::get('/gallery/active', [\App\Http\Controllers\GalleryController::class, 'getActive']);
Route::get('/gallery/categories', [\App\Http\Controllers\GalleryController::class, 'getCategories']);
Route::post('/gallery/bulk-upload', [\App\Http\Controllers\GalleryController::class, 'bulkUpload']);
Route::put('/gallery/{id}/toggle-status', [\App\Http\Controllers\GalleryController::class, 'toggleStatus']);
Route::put('/gallery/reorder', [\App\Http\Controllers\GalleryController::class, 'reorder']);

// Categories API routes
Route::apiResource('categories', CategoryController::class);

// Admin Barber Management API Routes
Route::prefix('admin')->group(function () {
    Route::get('/barbers', [\App\Http\Controllers\BarberController::class, 'index']);
    Route::post('/barbers', [\App\Http\Controllers\BarberController::class, 'store']);
    Route::get('/barbers/{barber}', [\App\Http\Controllers\BarberController::class, 'show']);
    Route::put('/barbers/{barber}', [\App\Http\Controllers\BarberController::class, 'update']);
    Route::delete('/barbers/{barber}', [\App\Http\Controllers\BarberController::class, 'destroy']);
}); 

// POS API
Route::get('/pos/items', [PosItemController::class, 'index']);
Route::get('/pos/sales', [PosSaleController::class, 'index']);
Route::post('/pos/sales', [PosSaleController::class, 'store']);
Route::get('/pos/sales/{id}', [PosSaleController::class, 'show']);
Route::get('/customers', [CustomerController::class, 'index']);
Route::post('/customers', [CustomerController::class, 'store']);

// Appointments API
Route::get('/appointments', [AppointmentController::class, 'index']);
Route::post('/appointments', [AppointmentController::class, 'store']);