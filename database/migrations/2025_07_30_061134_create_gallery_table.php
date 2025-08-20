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
        if (!Schema::hasTable('gallery')) {
            Schema::create('gallery', function (Blueprint $table) {
                $table->id();
                $table->string('image_path');
                $table->string('category'); // Haircuts, Beard, Interior, Team, Transformations
                $table->string('title')->nullable();
                $table->text('description')->nullable();
                $table->boolean('is_active')->default(true);
                $table->integer('sort_order')->default(0);
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gallery');
    }
};
