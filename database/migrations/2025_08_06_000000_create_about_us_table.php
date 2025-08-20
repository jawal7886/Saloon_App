<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('about_us', function (Blueprint $table) {
            $table->id();
            $table->string('heading')->nullable();
            $table->text('paragraph')->nullable();
            $table->timestamps();
        });

        // Insert a default row
        \DB::table('about_us')->insert([
            'heading' => 'About Our Barbershop',
            'paragraph' => 'Where traditional craftsmanship meets modern style. We create more than just haircuts – we craft confidence, style, and unforgettable experiences in our sanctuary of grooming excellence.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('about_us');
    }
};