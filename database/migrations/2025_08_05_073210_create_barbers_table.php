<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('barbers', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Barber's full name
            $table->string('position')->nullable(); // Position/title (e.g., Senior Barber, Master Barber)
            $table->text('bio')->nullable(); // Biography/description
            $table->string('image')->nullable(); // Profile image URL or file path
            $table->string('experience')->nullable(); // Years of experience
            $table->json('specialties')->nullable(); // Array of specialties (e.g., ["Fades", "Beard Trimming", "Hair Coloring"])
            $table->string('phone')->nullable(); // Contact phone number
            $table->string('email')->nullable(); // Contact email
            $table->json('social_media')->nullable(); // Social media links
            $table->boolean('is_active')->default(true); // Whether the barber is currently active
            $table->integer('sort_order')->default(0); // For ordering barbers in display
            $table->foreignId('salon_id')->nullable()->constrained()->onDelete('cascade'); // Relationship to salon
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barbers');
    }
};
