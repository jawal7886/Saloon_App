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
        Schema::create('salons', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Store name
            $table->string('tag_line')->nullable(); // Tag line or slogan
            $table->text('logo')->nullable(); // Logo base64 data or URL
            $table->string('address')->nullable(); // Physical address
            $table->string('phone1')->nullable(); // Primary phone number
            $table->string('phone2')->nullable(); // Secondary phone number
            $table->string('email1')->nullable(); // Primary email address
            $table->string('email2')->nullable(); // Secondary email address
            $table->text('description')->nullable(); // Store description
            $table->json('social_media')->nullable(); // Social media links (facebook, instagram, twitter)
            $table->json('hours')->nullable(); // Business hours for each day
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('salons');
    }
};
